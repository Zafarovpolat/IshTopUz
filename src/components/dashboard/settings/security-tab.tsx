
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecurityTab() {
  return (
    <div className="grid gap-6 mt-4">
        <Card>
          <form>
            <CardHeader>
                <CardTitle>Смена пароля</CardTitle>
                <CardDescription>
                    Рекомендуется использовать сложный пароль, который вы не используете на других сайтах.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Текущий пароль</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                    <Input id="confirm-password" type="password" />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Сохранить пароль</Button>
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
                <Button>Настроить 2FA</Button>
            </CardFooter>
        </Card>
    </div>
  );
}
