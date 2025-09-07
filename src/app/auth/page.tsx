'use client';

import { useState, useEffect, useRef } from 'react';
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
  signInWithTelegram,
  auth
} from '@/lib/auth';
import { ChromeIcon, Loader2, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
    interface Window {
        onTelegramAuth: (user: TelegramUser) => void;
    }
}

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
  
  const [telegramScriptLoaded, setTelegramScriptLoaded] = useState(false);
  const telegramLoginWidgetRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    window.onTelegramAuth = async (user: TelegramUser) => {
      setIsTelegramLoading(true);
      try {
        const firebaseUser = await signInWithTelegram(user);
        if (firebaseUser) {
          toast({ title: 'Успешный вход через Telegram!', description: `Добро пожаловать, ${firebaseUser.displayName || 'пользователь'}` });
          window.location.href = '/';
        } else {
          throw new Error('Не удалось получить пользователя Firebase.');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Ошибка входа через Telegram', description: 'Пожалуйста, попробуйте еще раз.' });
        console.error("Telegram sign-in error:", error);
      } finally {
        setIsTelegramLoading(false);
      }
    };
    
    if (document.getElementById('telegram-widget-script')) {
        setTelegramScriptLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.id = 'telegram-widget-script';
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.onload = () => {
        setTelegramScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // It's better not to remove the script to avoid issues on re-renders
      // but we should clear the callback
      delete (window as any).onTelegramAuth;
    };
  }, [toast]);


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

  const TelegramLoginButton = () => (
    <Button 
        variant="outline" 
        className="w-full relative overflow-hidden" 
        disabled={isTelegramLoading || isGoogleLoading || isLoginLoading || isSignUpLoading || !telegramScriptLoaded}
    >
        {isTelegramLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <MessageCircle className="mr-2 h-4 w-4" />
        )}
        Telegram
    </Button>
  );

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
                            
                            <div className="relative h-11">
                                 <TelegramLoginButton />
                                 <div className="absolute inset-0 opacity-0">
                                    {telegramScriptLoaded && (
                                      <div ref={telegramLoginWidgetRef} data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME} data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></div>
                                    )}
                                 </div>
                            </div>
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
                            <div className="relative h-11">
                                <TelegramLoginButton />
                                <div className="absolute inset-0 opacity-0">
                                   {telegramScriptLoaded && (
                                     <div ref={telegramLoginWidgetRef} data-telegram-login={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME} data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></div>
                                   )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
