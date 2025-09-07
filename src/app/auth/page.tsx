'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  setupRecaptcha,
  signInWithTelegram
} from '@/lib/auth';
import { ChromeIcon, Loader2 } from 'lucide-react';
import { MessageCircle } from 'lucide-react'; // Пример, замените на Telegram icon если нужно
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Recaptcha setup
    if (typeof window !== 'undefined' && !document.getElementById('recaptcha-container')) {
        const recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
        setupRecaptcha('recaptcha-container');
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);

    // Callback функция для Telegram
    window.onTelegramAuth = async (user: any) => {
      setIsTelegramLoading(true);
      const telegramUser = await signInWithTelegram(user);
      if (telegramUser) {
        toast({ title: 'Успешный вход через Telegram!', description: `Добро пожаловать, ${telegramUser.displayName || 'пользователь'}` });
        window.location.href = '/';
      } else {
        toast({ variant: 'destructive', title: 'Ошибка входа через Telegram', description: 'Пожалуйста, попробуйте еще раз.' });
      }
      setIsTelegramLoading(false);
    };

    return () => {
      document.body.removeChild(script);
      delete window.onTelegramAuth;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const user = await signInWithEmail(loginEmail, loginPassword);
    if (user) {
      toast({ title: 'Успешный вход!', description: `Добро пожаловать, ${user.email}` });
      window.location.href = '/';
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа', description: 'Проверьте email и пароль.' });
    }
    setIsLoginLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
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
      window.location.href = '/';
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа через Google', description: 'Пожалуйста, попробуйте еще раз.' });
    }
    setIsGoogleLoading(false);
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
                                <Input id="login-email" type="email" placeholder="you@example.com" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} disabled={isLoginLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Пароль</Label>
                                <Input id="login-password" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} disabled={isLoginLoading} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoginLoading}>
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
                            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChromeIcon className="mr-2 h-4 w-4" />}
                                Google
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
                                <Input id="signup-email" type="email" placeholder="you@example.com" required value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} disabled={isSignUpLoading}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Пароль</Label>
                                <Input id="signup-password" type="password" required value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} disabled={isSignUpLoading}/>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSignUpLoading}>
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
                  <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                    {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChromeIcon className="mr-2 h-4 w-4" />}
                    Google
                  </Button>
                  {/* Добавьте ту же кнопку для Telegram в signup (Telegram может использоваться для sign up тоже) */}
                  <Button variant="outline" disabled={isTelegramLoading} asChild>
                    <div 
                      data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME}
                      data-size="large"
                      data-onauth="onTelegramAuth(user)"
                      data-request-access="write"
                    >
                      {isTelegramLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                      Telegram
                    </div>
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
