'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateNotificationSettings } from '@/app/dashboard/settings/actions';
import type { NotificationSettings } from '@/lib/schema';

type Props = { initial: NotificationSettings };

export function NotificationsTab({ initial }: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<NotificationSettings>(initial);

  function set<K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function onSave() {
    startTransition(async () => {
      const res = await updateNotificationSettings(state);
      toast({
        variant: res.success ? 'default' : 'destructive',
        title: res.success ? 'Сохранено' : 'Ошибка',
        description: res.message ?? '',
      });
    });
  }

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
            <Switch
              id="email-news"
              checked={state.emailNews}
              onCheckedChange={(v) => set('emailNews', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="email-messages" className="flex flex-col space-y-1">
              <span>Новые сообщения</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Получайте уведомления о новых сообщениях в чате.
              </span>
            </Label>
            <Switch
              id="email-messages"
              checked={state.emailMessages}
              onCheckedChange={(v) => set('emailMessages', v)}
            />
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
            <Switch
              id="telegram-invites"
              checked={state.telegramInvites}
              onCheckedChange={(v) => set('telegramInvites', v)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="telegram-messages" className="flex flex-col space-y-1">
              <span>Сообщения в Telegram</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Получайте дубли сообщений в Telegram.
              </span>
            </Label>
            <Switch
              id="telegram-messages"
              checked={state.telegramMessages}
              onCheckedChange={(v) => set('telegramMessages', v)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? 'Сохраняем…' : 'Сохранить'}
        </Button>
      </CardFooter>
    </Card>
  );
}
