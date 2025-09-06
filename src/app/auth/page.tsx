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
  signInWithTelegram,
  setupRecaptcha,
} from '@/lib/auth';
import { ChromeIcon, Loader2 } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4" />
        </svg>
    )
}

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      setupRecaptcha('recaptcha-container');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const user = await signInWithEmail(loginEmail, loginPassword);
    if (user) {
      toast({ title: 'Успешный вход!', description: `Добро пожаловать, ${user.email}` });
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
    } else {
      toast({ variant: 'destructive', title: 'Ошибка входа через Google', description: 'Пожалуйста, попробуйте еще раз.' });
    }
    setIsGoogleLoading(false);
  };

  const handleTelegramSignIn = async () => {
    await signInWithTelegram();
    toast({ variant: 'default', title: 'Вход через Telegram', description: 'Эта функция пока не реализована.' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50 p-4">
        <div id="recaptcha-container" />
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
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChromeIcon className="mr-2 h-4 w-4" />}
                                Google
                            </Button>
                            <Button variant="outline" onClick={handleTelegramSignIn}>
                                <TelegramIcon className="mr-2 h-4 w-4" /> Telegram
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
                    </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
