
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTestPage() {

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Тестовая страница дашборда</CardTitle>
                        <CardDescription>
                            Эта страница доступна без входа в систему. Используйте вкладки ниже для переключения между дашбордами клиента и фрилансера.
                        </CardDescription>
                    </CardHeader>
                 </Card>
                <Tabs defaultValue="client">
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
