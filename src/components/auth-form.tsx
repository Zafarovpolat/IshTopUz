'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithCustomTokenFunc,
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
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.69.42z"/>
    </svg>
);


export function AuthForm() {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isCustomLoading, setIsCustomLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Обработка query-параметров для Telegram auth
  useEffect(() => {
    const provider = searchParams.get('provider');
    const token = searchParams.get('token');

    if (provider === 'telegram' && token && !isCustomLoading) {
      setIsCustomLoading(true);
      handleCustomSignIn(token);
    }
  }, [searchParams, isCustomLoading]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const user = await signInWithEmail(loginEmail, loginPassword);
    if (user) {
      toast({ title: 'Успешный вход!', description: `Добро пожаловать, ${user.email}` });
      router.push('/');
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа', description: 'Проверьте email и пароль.' });
    }
    setIsLoginLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSignUpLoading(true);
    const user = await signUpWithEmail(signUpEmail, signUpPassword);
    if (user) {
      toast({ title: 'Регистрация успешна!', description: 'Пожалуйста, проверьте свою почту для верификации.' });
    } else {
      toast({ variant: 'destructive', title: 'Ошибка регистрации', description: 'Возможно, этот email уже используется.' });
    }
    setIsSignUpLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const user = await signInWithGoogle();
    if (user) {
      toast({ title: 'Успешный вход через Google!', description: `Добро пожаловать, ${user.displayName}` });
      router.push('/');
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа через Google', description: 'Пожалуйста, попробуйте еще раз.' });
    }
    setIsGoogleLoading(false);
  };

  const handleCustomSignIn = async (token: string) => {
    const user: User | null = await signInWithCustomTokenFunc(token);
    if (user) {
      toast({
        title: 'Успешный вход через Telegram!',
        description: `Добро пожаловать, ${user.displayName || user.email || 'пользователь'}`,
      });
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка входа через Telegram',
        description: 'Неверный токен или сессия истекла.',
      });
    }
    setIsCustomLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Войти</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Вход в аккаунт</CardTitle>
                <CardDescription>Введите ваш email и пароль для входа.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoginLoading || isCustomLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoginLoading || isCustomLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoginLoading || isCustomLoading}>
                    {isLoginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoginLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Или войдите через</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                <Button
                    variant="outline"
                    className="bg-white text-gray-700 hover:bg-gray-50"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isCustomLoading}
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
                    disabled={isCustomLoading}
                  >
                    {isCustomLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TelegramIcon className="mr-2 h-5 w-5" />
                    )}
                    Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Регистрация</CardTitle>
                <CardDescription>Создайте новый аккаунт, чтобы начать.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      disabled={isSignUpLoading || isCustomLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Пароль</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      disabled={isSignUpLoading || isCustomLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSignUpLoading || isCustomLoading}>
                    {isSignUpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSignUpLoading ? 'Создание...' : 'Создать аккаунт'}
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Или зарегистрируйтесь через</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="bg-white text-gray-700 hover:bg-gray-50"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isCustomLoading}
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
                    disabled={isCustomLoading}
                  >
                    {isCustomLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TelegramIcon className="mr-2 h-5 w-5" />
                    )}
                    Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
