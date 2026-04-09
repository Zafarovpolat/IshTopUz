'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { updatePrivacySettings } from '@/app/dashboard/settings/actions';
import type { PrivacySettings } from '@/lib/schema';

type Props = { initial: PrivacySettings };

export function PrivacyTab({ initial }: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<PrivacySettings['profileVisibility']>(
    initial.profileVisibility
  );

  function onSave() {
    startTransition(async () => {
      const res = await updatePrivacySettings({ profileVisibility: value });
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
        <CardTitle>Приватность</CardTitle>
        <CardDescription>
          Настройте видимость вашего профиля на платформе.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={value}
          onValueChange={(v) => setValue(v as PrivacySettings['profileVisibility'])}
          className="gap-4"
        >
          <Label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer">
            <RadioGroupItem value="visible" id="r1" className="mt-1" />
            <div className="grid gap-1.5">
              <span className="font-semibold">Виден всем</span>
              <span className="text-sm text-muted-foreground">
                Ваш профиль будет виден всем пользователям и гостям платформы.
                Рекомендуется для активного поиска заказов.
              </span>
            </div>
          </Label>
          <Label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer">
            <RadioGroupItem value="platform-only" id="r2" className="mt-1" />
            <div className="grid gap-1.5">
              <span className="font-semibold">Только для пользователей IshTop.Uz</span>
              <span className="text-sm text-muted-foreground">
                Ваш профиль будет виден только зарегистрированным пользователям платформы.
              </span>
            </div>
          </Label>
          <Label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer">
            <RadioGroupItem value="hidden" id="r3" className="mt-1" />
            <div className="grid gap-1.5">
              <span className="font-semibold">Скрыт</span>
              <span className="text-sm text-muted-foreground">
                Ваш профиль будет полностью скрыт. Вы сможете откликаться на проекты,
                но заказчики не смогут найти вас через поиск.
              </span>
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isPending}>
          {isPending ? 'Сохраняем…' : 'Сохранить'}
        </Button>
      </CardFooter>
    </Card>
  );
}
