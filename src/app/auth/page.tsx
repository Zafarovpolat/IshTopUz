'use client';

import { useState, useEffect } from 'react';
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
import { ChromeIcon, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';
import type { User } from 'firebase/auth';

export default function AuthPage() {
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
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isCustomLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChromeIcon className="mr-2 h-4 w-4" />
                    )}
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://t.me/ishtopuz_auth_helper_bot', '_blank')}
                    disabled={isCustomLoading}
                  >
                    {isCustomLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-.86-.22-1.33-.47-.36-.19-.76-.39-1.94-1.25-.78-.56-.28-.86.13-1.22.1-.09 1.75-1.58 1.78-1.71.02-.09 0-.24-.11-.34-.12-.1-.28-.08-.38-.04-.09.03-1.45.94-4.09 2.76-.24.16-.46.31-.65.33-.22.02-.62-.08-.88-.2-.34-.16-.58-.35-.56-.64.01-.15.22-.98 1.13-3.02 1.78-3.99 3.49-6.09 3.49-6.09s.34-.22.54-.08c.2.14.14.42.05.62z"
                        />
                      </svg>
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
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading || isCustomLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChromeIcon className="mr-2 h-4 w-4" />
                    )}
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://t.me/ishtopuz_auth_helper_bot', '_blank')}
                    disabled={isCustomLoading}
                  >
                    {isCustomLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-.86-.22-1.33-.47-.36-.19-.76-.39-1.94-1.25-.78-.56-.28-.86.13-1.22.1-.09 1.75-1.58 1.78-1.71.02-.09 0-.24-.11-.34-.12-.1-.28-.08-.38-.04-.09.03-1.45.94-4.09 2.76-.24.16-.46.31-.65.33-.22.02-.62-.08-.88-.2-.34-.16-.58-.35-.56-.64.01-.15.22-.98 1.13-3.02 1.78-3.99 3.49-6.09 3.49-6.09s.34-.22.54-.08c.2.14.14.42.05.62z"
                        />
                      </svg>
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
