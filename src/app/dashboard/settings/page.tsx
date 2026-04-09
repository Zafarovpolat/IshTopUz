import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationsTab } from '@/components/dashboard/settings/notifications-tab';
import { PrivacyTab } from '@/components/dashboard/settings/privacy-tab';
import { SecurityTab } from '@/components/dashboard/settings/security-tab';
import { getUserSettings } from './actions';

export default async function SettingsPage() {
  const settings = await getUserSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управляйте настройками вашего аккаунта, уведомлениями и безопасностью.
        </p>
      </div>
      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="privacy">Приватность</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <NotificationsTab initial={settings.notifications} />
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacyTab initial={settings.privacy} />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
