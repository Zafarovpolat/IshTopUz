'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updatePassword } from '@/app/dashboard/settings/actions';

export function SecurityTab() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      currentPassword: String(fd.get('currentPassword') || ''),
      newPassword: String(fd.get('newPassword') || ''),
      confirmPassword: String(fd.get('confirmPassword') || ''),
    };

    startTransition(async () => {
      const res = await updatePassword(payload);
      if (res.success) {
        toast({ title: 'Готово', description: res.message });
        setErrors({});
        form.reset();
      } else {
        setErrors(res.errors ?? {});
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: res.message ?? 'Не удалось изменить пароль.',
        });
      }
    });
  }

  return (
    <div className="grid gap-6 mt-4">
      <Card>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>Смена пароля</CardTitle>
            <CardDescription>
              Рекомендуется использовать сложный пароль, который вы не используете на других сайтах.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Сохраняем…' : 'Сохранить пароль'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Двухфакторная аутентификация</CardTitle>
          <CardDescription>
            Добавьте дополнительный уровень безопасности для защиты вашего аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Двухфакторная аутентификация пока не настроена.
          </p>
        </CardContent>
        <CardFooter>
          <Button disabled>Скоро</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
