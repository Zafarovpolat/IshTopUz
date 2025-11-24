'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition, useEffect } from 'react';
import type { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { onboardingSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from './layout/logo';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithCustomToken, type User } from 'firebase/auth';
import { Loader2, Mail } from 'lucide-react';
import { createUserOnboarding } from '@/app/actions';

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// ✅ Функция для создания/обновления session cookie
const createSessionCookie = async (user: User): Promise<boolean> => {
  try {
    console.log('🔄 [OnboardingForm] Creating session cookie for user:', user.uid);

    // Получаем свежий idToken
    const idToken = await user.getIdToken(true); // force refresh = true

    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [OnboardingForm] Session API error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ [OnboardingForm] Session cookie created:', data);

    return true;
  } catch (error) {
    console.error('❌ [OnboardingForm] Failed to create session cookie:', error);
    return false;
  }
};

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userType: undefined,
      email: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        // Устанавливаем email только если он есть и форма пустая
        const currentEmail = form.getValues('email');
        if (user.email && !currentEmail) {
          form.setValue('email', user.email);
        }
      } else {
        router.push('/auth');
      }
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, [router, form]);

  // Определяем тип провайдера
  const isTelegramUser = currentUser?.uid?.startsWith('telegram:') ||
    currentUser?.providerData?.some(p => p.providerId === 'custom') ||
    false;

  const isGoogleUser = currentUser?.providerData?.some(p => p.providerId === 'google.com') || false;

  console.log('👤 User info in onboarding:', {
    uid: currentUser?.uid,
    email: currentUser?.email,
    isTelegramUser,
    isGoogleUser,
    providers: currentUser?.providerData?.map(p => p.providerId),
  });

  const onSubmit = (data: OnboardingFormValues) => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Ошибка аутентификации. Пожалуйста, войдите снова.',
      });
      router.push('/auth');
      return;
    }

    startTransition(async () => {
      try {
        console.log('📤 [OnboardingForm] Submitting onboarding data...');

        // ШАГ 1: Сохраняем данные onboarding
        const result = await createUserOnboarding(currentUser.uid, data);

        console.log('📥 [OnboardingForm] Onboarding result:', result);

        if (result.success) {
          // ✅ ШАГ 2: Если получили новый токен - переавторизуемся
          if (result.newToken) {
            console.log('🔑 [OnboardingForm] Got new token, signing in...');

            try {
              // Входим с новым токеном
              await signInWithCustomToken(auth, result.newToken);
              console.log('✅ [OnboardingForm] Signed in with new token');

              // Небольшая задержка для обновления auth state
              await new Promise(resolve => setTimeout(resolve, 500));

              // Получаем обновленного пользователя
              const updatedUser = auth.currentUser;
              if (!updatedUser) {
                throw new Error('No current user after sign in');
              }

              // ✅ ШАГ 3: Создаем session cookie с новым токеном
              console.log('🔄 [OnboardingForm] Creating session cookie...');
              const sessionCreated = await createSessionCookie(updatedUser);

              if (!sessionCreated) {
                console.error('❌ [OnboardingForm] Failed to create session cookie');
                toast({
                  variant: 'destructive',
                  title: 'Ошибка сессии',
                  description: 'Не удалось создать сессию. Попробуйте войти снова.',
                });
                router.push('/auth');
                return;
              }

              console.log('✅ [OnboardingForm] Session cookie created successfully');

            } catch (authError) {
              console.error('❌ [OnboardingForm] Re-auth failed:', authError);
              toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Не удалось обновить сессию. Попробуйте войти снова.',
              });
              router.push('/auth');
              return;
            }
          } else {
            // Если нового токена нет - просто создаем session cookie
            console.log('🔄 [OnboardingForm] Creating session cookie...');
            const sessionCreated = await createSessionCookie(currentUser);

            if (!sessionCreated) {
              console.error('❌ [OnboardingForm] Failed to create session cookie');
              toast({
                variant: 'destructive',
                title: 'Ошибка сессии',
                description: 'Не удалось создать сессию. Попробуйте войти снова.',
              });
              router.push('/auth');
              return;
            }
          }

          toast({
            title: 'Успешно!',
            description: 'Ваш профиль обновлен.',
          });

          // ✅ ШАГ 4: Небольшая задержка чтобы cookie успела сохраниться
          await new Promise(resolve => setTimeout(resolve, 500));

          const redirectPath = result.redirectUrl || '/dashboard';
          console.log('🚀 [OnboardingForm] Redirecting to:', redirectPath);

          router.push(redirectPath);

        } else {
          toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: result.message || 'Что-то пошло не так. Попробуйте позже.',
          });
        }
      } catch (error) {
        console.error('❌ [OnboardingForm] Unexpected error:', error);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Произошла непредвиденная ошибка.',
        });
      }
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
          <Logo />
        </div>
        <CardTitle className="text-3xl font-bold">Завершение регистрации</CardTitle>
        <CardDescription className="text-muted-foreground">
          Расскажите нам немного о себе, чтобы мы могли персонализировать ваш опыт.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Иванов" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      disabled={isGoogleUser || isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  {isTelegramUser && !currentUser?.email && (
                    <FormDescription className="text-xs">
                      ℹ️ Используется для входа и восстановления доступа.
                    </FormDescription>
                  )}
                  {isGoogleUser && currentUser?.email && (
                    <FormDescription className="text-xs">
                      ✅ Email из вашего Google аккаунта: <strong>{currentUser.email}</strong>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Я хочу...</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вашу основную роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="freelancer">Найти работу (Я фрилансер)</SelectItem>
                      <SelectItem value="client">Нанять специалиста (Я заказчик)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isPending || isLoadingUser}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Продолжить'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}