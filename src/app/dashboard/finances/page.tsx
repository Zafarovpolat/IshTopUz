
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/dashboard/finances/overview-tab";
import { WithdrawalMethodsTab } from "@/components/dashboard/finances/withdrawal-methods-tab";
import { ReportsTab } from "@/components/dashboard/finances/reports-tab";

export default function FinancesPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Финансы</h1>
            <p className="text-muted-foreground">
                Управляйте своими доходами, выводите средства и отслеживайте статистику.
            </p>
        </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="withdrawal">Вывод средств</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <OverviewTab />
        </TabsContent>
        <TabsContent value="withdrawal">
            <WithdrawalMethodsTab />
        </TabsContent>
        <TabsContent value="reports">
            <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
