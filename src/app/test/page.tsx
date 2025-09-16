
'use client';
import { useState } from 'react';
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import type { User } from 'firebase/auth';

const mockUser = {
  uid: 'test-user',
  email: 'test@example.com',
  displayName: 'Тестовый Пользователь',
  photoURL: 'https://i.pravatar.cc/150?u=test',
  profile: {
    firstName: 'Тест',
    lastName: 'Тестов',
    avatar: 'https://i.pravatar.cc/150?u=test'
  }
};

export default function DashboardTestPage() {
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar userType={activeTab} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <DashboardHeader user={mockUser as User} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Тестовая страница дашборда</CardTitle>
              <CardDescription>
                Эта страница доступна без входа в систему. Используйте вкладки ниже для переключения между дашбордами клиента и фрилансера.
              </CardDescription>
            </CardHeader>
          </Card>
          <Tabs defaultValue="client" onValueChange={(value) => setActiveTab(value as 'client' | 'freelancer')}>
            <TabsList>
              <TabsTrigger value="client">Дашборд клиента</TabsTrigger>
              <TabsTrigger value="freelancer">Дашборд фрилансера</TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <ClientDashboard />
            </TabsContent>
            <TabsContent value="freelancer">
              <FreelancerDashboard />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
