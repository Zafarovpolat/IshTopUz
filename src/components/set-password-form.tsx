'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import type { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { setPasswordSchema } from '@/lib/schema';
import { setUserPassword } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from './layout/logo';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export function SetPasswordForm({ email, fullName }: { email: string; fullName?: string }) {
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SetPasswordFormValues>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: SetPasswordFormValues) => {
        startTransition(async () => {
            try {
                console.log('🔐 Submitting password...');

                const result = await setUserPassword(data.password);

                console.log('📥 Set password result:', result);

                if (result.success) {
                    if (result.requiresReauth) {
                        toast({
                            title: 'Пароль установлен!',
                            description: 'Сейчас вы будете перенаправлены на страницу входа.',
                        });

                        console.log('🚪 Logging out and cleaning up...');

                        try {
                            await fetch('/api/auth/signout', { method: 'POST' });
                            console.log('✅ Server session cookie deleted');
                        } catch (error) {
                            console.error('⚠️ Failed to delete server session:', error);
                        }

                        try {
                            await auth.signOut();
                            console.log('✅ Client auth signed out');
                        } catch (error) {
                            console.error('⚠️ Failed to sign out on client:', error);
                        }

                        await new Promise(resolve => setTimeout(resolve, 500));

                        console.log('🚀 Redirecting to /auth');
                        router.push('/auth?message=password-set');
                    } else {
                        router.push('/dashboard');
                    }
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Ошибка',
                        description: result.message || 'Не удалось установить пароль.',
                    });
                }
            } catch (error) {
                console.error('❌ Unexpected error:', error);
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Произошла непредвиденная ошибка.',
                });
            }
        });
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-fit">
                    <Logo />
                </div>
                <CardTitle className="text-3xl font-bold">
                    {fullName ? `Привет, ${fullName}! 👋` : 'Создайте пароль'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Установите пароль для входа через email: <strong>{email}</strong>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Пароль
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Минимум 6 символов"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isPending}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Минимум 6 символов
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Подтвердите пароль
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Повторите пароль"
                                                {...field}
                                                disabled={isPending}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isPending}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Сохранение...
                                </>
                            ) : (
                                'Установить пароль'
                            )}
                        </Button>

                        <div className="text-center">
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => router.push('/dashboard')}
                                className="text-sm text-muted-foreground"
                                disabled={isPending}
                            >
                                Пропустить (сделать позже)
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}