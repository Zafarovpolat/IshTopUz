'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithCustomTokenFunc,
  resetPassword,
  auth
} from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';
import type { User } from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 262" {...props}>
    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
    <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
    <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
    <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg id="telegram-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.69.42z" />
  </svg>
);

const createSessionCookie = async (user: User) => {
  const idToken = await user.getIdToken();
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
};

const handleAuthSuccess = async (result: { user: User; isNewUser: boolean } | null, router: any, toast: any, providerName: string) => {
  if (result) {
    const cookieCreated = await createSessionCookie(result.user);
    if (!cookieCreated) {
      toast({ variant: 'destructive', title: `Ошибка сессии`, description: 'Не удалось создать сессию. Попробуйте еще раз.' });
      return;
    }

    // ✅ Определяем имя для приветствия
    const userName = result.user.displayName || result.user.email?.split('@')[0] || 'пользователь';

    toast({
      title: `Успешный вход через ${providerName}!`,
      description: `Добро пожаловать, ${userName}!`
    });

    if (result.isNewUser) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  } else {
    toast({ variant: 'destructive', title: `Ошибка входа через ${providerName}`, description: 'Пожалуйста, попробуйте еще раз.' });
  }
};

function AuthFormContent() {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isCustomLoading, setIsCustomLoading] = useState<boolean>(false);
  const [telegramProcessed, setTelegramProcessed] = useState<boolean>(false); // ✅ Флаг для предотвращения повторной обработки
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Обработка message из URL
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'password-set') {
      toast({
        title: 'Пароль установлен!',
        description: 'Теперь войдите используя ваш email и новый пароль.',
        duration: 6000, // ✅ Показываем дольше
      });
      // Очищаем параметр
      window.history.replaceState({}, '', '/auth');
    }
  }, [searchParams, toast]);

  // ✅ Обработка Telegram входа (исправлено)
  useEffect(() => {
    const provider = searchParams.get('provider');
    const token = searchParams.get('token');

    // Проверяем что это Telegram вход и он еще не обработан
    if (provider === 'telegram' && token && !telegramProcessed && !isCustomLoading) {
      console.log('🔵 Processing Telegram login...');

      // Сразу помечаем как обработанный
      setTelegramProcessed(true);
      setIsCustomLoading(true);

      // Удаляем параметры из URL
      window.history.replaceState({}, '', '/auth');

      // Выполняем вход
      (async () => {
        try {
          const result = await signInWithCustomTokenFunc(token);
          await handleAuthSuccess(result, router, toast, 'Telegram');
        } catch (error) {
          console.error('Telegram login error:', error);
          toast({
            variant: 'destructive',
            title: 'Ошибка входа',
            description: 'Не удалось войти через Telegram.'
          });
        } finally {
          setIsCustomLoading(false);
        }
      })();
    }
  }, [searchParams, telegramProcessed, isCustomLoading, router, toast]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signInWithEmail(email, password);
    await handleAuthSuccess(result, router, toast, 'Email');
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signUpWithEmail(email, password);
    if (result) {
      const cookieCreated = await createSessionCookie(result.user);
      if (!cookieCreated) {
        toast({ variant: 'destructive', title: `Ошибка сессии`, description: 'Не удалось создать сессию. Попробуйте еще раз.' });
        setIsLoading(false);
        return;
      }
      toast({ title: 'Регистрация успешна!', description: 'Теперь давайте завершим настройку вашего профиля.' });
      router.push('/onboarding');
    } else {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: 'Возможно, этот email уже используется.' });
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    await handleAuthSuccess(result, router, toast, 'Google');
    setIsGoogleLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({ variant: 'destructive', title: 'Email не указан', description: 'Пожалуйста, введите ваш email.' });
      return;
    }
    setIsLoading(true);
    const success = await resetPassword(email);
    if (success) {
      toast({
        title: 'Письмо отправлено',
        description: 'Проверьте вашу почту для сброса пароля.',
      });
      setView('login');
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось отправить письмо. Возможно, аккаунт с таким email не существует.',
      });
    }
    setIsLoading(false);
  };

  // ✅ Показываем загрузку пока обрабатывается Telegram вход
  if (isCustomLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Вход через Telegram...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {view === 'forgot-password' ? (
          <Card>
            <CardHeader>
              <CardTitle>Сброс пароля</CardTitle>
              <CardDescription>Введите ваш email, и мы отправим вам ссылку для восстановления пароля.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Отправка...' : 'Отправить'}
                </Button>
              </form>
              <Button variant="link" className="w-full h-auto p-0" onClick={() => setView('login')}>
                Вернуться ко входу
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{view === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</CardTitle>
              <CardDescription>
                {view === 'login' ? 'Введите ваш email и пароль для входа.' : 'Создайте новый аккаунт, чтобы начать.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={view === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Пароль</Label>
                    {view === 'login' && (
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm"
                        onClick={() => setView('forgot-password')}
                      >
                        Забыли пароль?
                      </Button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete={view === 'login' ? "current-password" : "new-password"}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {view === 'login' ? (isLoading ? 'Вход...' : 'Войти') : (isLoading ? 'Создание...' : 'Создать аккаунт')}
                </Button>
              </form>

              <div className="text-center text-sm">
                {view === 'login' ? (
                  <>
                    Нет аккаунта?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setView('signup')}>
                      Зарегистрироваться
                    </Button>
                  </>
                ) : (
                  <>
                    Уже есть аккаунт?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setView('login')}>
                      Войти
                    </Button>
                  </>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Или продолжить через</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="bg-white text-gray-700 hover:bg-gray-50"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="mr-2 h-5 w-5" />
                  )}
                  Google
                </Button>
                <Button
                  className="bg-[#27A7E7] text-white hover:bg-[#27A7E7]/90"
                  onClick={() => window.open('https://t.me/ishtopuz_auth_helper_bot', '_blank')}
                >
                  <TelegramIcon className="mr-2" />
                  Telegram
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ✅ Оборачиваем в Suspense
export function AuthForm() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <AuthFormContent />
    </Suspense>
  );
}