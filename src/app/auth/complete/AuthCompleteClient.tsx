
'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function AuthCompleteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const completeAuth = async () => {
      const token = searchParams.get('token');
      if (token) {
        try {
          const userCredential = await signInWithCustomToken(auth, token);
          const user = userCredential.user;
          toast({
            title: 'Успешный вход через Telegram!',
            description: `Добро пожаловать, ${user.displayName}`,
          });
          router.push('/'); // Перенаправление после входа
        } catch (error: any) {
          console.error('Error signing in with custom token:', error.message);
          toast({
            variant: 'destructive',
            title: 'Ошибка входа',
            description: 'Не удалось авторизоваться через Telegram.',
          });
          router.push('/auth');
        }
      } else {
        // Если токена нет, возможно, пользователь зашел на страницу напрямую
        toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: 'Токен для аутентификации не найден.',
          });
        router.push('/auth');
      }
    };
    if (searchParams) {
        completeAuth();
    }
  }, [searchParams, router, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="mr-2 h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Завершение авторизации...</p>
    </div>
  );
}
