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
} from '@/lib/auth';
import { ChromeIcon, Loader2, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

// Дополняем интерфейс Window для Telegram
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
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

  useEffect(() => {
    // Recaptcha setup
    if (typeof window !== 'undefined' && !document.getElementById('recaptcha-container')) {
        const recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
        setupRecaptcha('recaptcha-container');
    }

    // Telegram Login Widget setup
    if (typeof window !== 'undefined') {
      // Создаем глобальную функцию для callback'а Telegram
      window.onTelegramAuth = handleTelegramAuth;
      
      // Загружаем скрипт Telegram Widget
      if (!document.getElementById('telegram-widget-script')) {
        const script = document.createElement('script');
        script.id = 'telegram-widget-script';
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'ishtopuz_auth_helper_bot'); // Замените на имя вашего бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        document.head.appendChild(script);
      }
    }
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

  const handleTelegramAuth = async (user: any) => {
    setIsTelegramLoading(true);
    try {
      // Отправляем данные пользователя Telegram на ваш бекенд для верификации
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (result.success) {
        toast({ 
          title: 'Успешный вход через Telegram!', 
          description: `Добро пожаловать, ${user.first_name}!` 
        });
        window.location.href = '/';
      } else {
        throw new Error(result.error || 'Ошибка аутентификации');
      }
    } catch (error) {
      console.error('Telegram auth error:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Ошибка входа через Telegram', 
        description: 'Пожалуйста, попробуйте еще раз.' 
      });
    } finally {
      setIsTelegramLoading(false);
    }
  };

  const handleTelegramButtonClick = () => {
    // Программно создаем и кликаем по кнопке Telegram
    const telegramButton = document.querySelector('iframe[src*="oauth.telegram.org"]');
    if (telegramButton) {
      (telegramButton as HTMLElement).click();
    } else {
      // Fallback: создаем временную кнопку Telegram
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <script async src="https://telegram.org/js/telegram-widget.js?22" 
                data-telegram-login="YOUR_BOT_USERNAME" 
                data-size="large" 
                data-onauth="onTelegramAuth(user)" 
                data-request-access="write">
        </script>
      `;
      document.body.appendChild(tempDiv);
      setTimeout(() => document.body.removeChild(tempDiv), 100);
    }
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
                            <Button variant="outline" onClick={handleTelegramButtonClick} disabled={isTelegramLoading} className="bg-[#0088cc] hover:bg-[#0077b3] text-white border-[#0088cc]">
                                {isTelegramLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                                Telegram
                            </Button>
                        </div>
                        
                        {/* Скрытый div для Telegram Widget */}
                        <div id="telegram-login-widget" style={{display: 'none'}}></div>
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
                            <Button variant="outline" onClick={handleTelegramButtonClick} disabled={isTelegramLoading} className="bg-[#0088cc] hover:bg-[#0077b3] text-white border-[#0088cc]">
                                {isTelegramLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
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