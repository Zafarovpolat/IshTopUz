
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationsTab() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Уведомления</CardTitle>
        <CardDescription>
          Выберите, как вы хотите получать уведомления о важных событиях.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">По Email</h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="email-news" className="flex flex-col space-y-1">
              <span>Новости и обновления</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Получайте новости о продукте и обновлениях функций.
              </span>
            </Label>
            <Switch id="email-news" defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="email-messages" className="flex flex-col space-y-1">
              <span>Новые сообщения</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Получайте уведомления о новых сообщениях в чате.
              </span>
            </Label>
            <Switch id="email-messages" defaultChecked />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">По Telegram</h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="telegram-invites" className="flex flex-col space-y-1">
              <span>Приглашения в проекты</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Получайте мгновенные уведомления о приглашениях.
              </span>
            </Label>
            <Switch id="telegram-invites" />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="telegram-bot" className="flex flex-col space-y-1">
              <span>Статус бота</span>
               <span className="font-normal leading-snug text-green-600">
                Ваш Telegram аккаунт успешно подключен.
              </span>
            </Label>
            <Button variant="destructive" size="sm">Отключить</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
