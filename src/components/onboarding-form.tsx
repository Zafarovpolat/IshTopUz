
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import type { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { onboardingSchema } from '@/lib/schema';
import { submitOnboarding } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Logo } from './layout/logo';

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userType: undefined,
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    startTransition(async () => {
      const result = await submitOnboarding(data);
      if (result.success) {
        toast({
          title: 'Успешно!',
          description: 'Ваш профиль создан. Добро пожаловать!',
        });
        router.push('/dashboard'); // Перенаправляем в будущий личный кабинет
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: result.message || 'Не удалось сохранить данные.',
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
            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Продолжить'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
