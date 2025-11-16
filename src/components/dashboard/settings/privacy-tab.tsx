
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function PrivacyTab() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Приватность</CardTitle>
        <CardDescription>
          Настройте видимость вашего профиля на платформе.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue="visible" className="gap-4">
          <Label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer">
             <RadioGroupItem value="visible" id="r1" className="mt-1"/>
            <div className="grid gap-1.5">
                <span className="font-semibold">Виден всем</span>
                <span className="text-sm text-muted-foreground">
                    Ваш профиль будет виден всем пользователям и гостям платформы. Рекомендуется для активного поиска заказов.
                </span>
            </div>
          </Label>
           <Label className="flex items-start gap-4 rounded-lg border p-4 cursor-pointer">
             <RadioGroupItem value="platform-only" id="r2" className="mt-1"/>
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
                    Ваш профиль будет полностью скрыт. Вы сможете откликаться на проекты, но заказчики не смогут найти вас через поиск.
                </span>
            </div>
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
