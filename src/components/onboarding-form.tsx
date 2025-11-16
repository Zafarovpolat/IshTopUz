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
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Loader2, Mail } from 'lucide-react';
import { createUserOnboarding } from '@/app/actions';

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/auth');
      }
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ ОПРЕДЕЛЯЕМ: нужно ли показывать поле email
  const needsEmail = currentUser && !currentUser.email;

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userType: undefined,
      email: '', // ✅ НОВОЕ поле
    },
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
      const result = await createUserOnboarding(currentUser.uid, data);

      console.log('📥 Onboarding result:', result); // ✅ ДОБАВЬ ЭТО

      if (result.success) {
        toast({
          title: 'Успешно!',
          description: 'Ваш профиль обновлен.',
        });

        // ✅ ПРОВЕРЬ ЧТО ЭТО ЕСТЬ:
        const redirectPath = result.redirectUrl || '/dashboard';
        console.log('🚀 Redirecting to:', redirectPath); // ✅ ДОБАВЬ ЭТО

        router.push(redirectPath);
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: result.message || 'Что-то пошло не так. Попробуйте позже.',
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
                      <Input placeholder="Иван" {...field} />
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
                      <Input placeholder="Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ✅ ИЗМЕНЕНО: Email всегда показывается и обязателен */}
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
                      defaultValue={currentUser?.email || ''} // ✅ Pre-fill если есть
                      disabled={!!currentUser?.email} // ✅ Disable если уже есть email (Google users)
                    />
                  </FormControl>
                  {!currentUser?.email && (
                    <FormDescription className="text-xs">
                      Используется для входа и восстановления доступа.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              {isPending ? 'Сохранение...' : 'Продолжить'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}