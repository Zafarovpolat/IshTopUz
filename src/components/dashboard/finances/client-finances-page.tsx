
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientOverviewTab } from "./client/client-overview-tab";
import { ClientPaymentMethodsTab } from "./client/client-payment-methods-tab";
import { ClientReportsTab } from "./client/client-reports-tab";

export function ClientFinancesPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Финансы</h1>
            <p className="text-muted-foreground">
                Управляйте балансом, платежами и документами для бухгалтерии.
            </p>
        </div>
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="payment-methods">Способы оплаты</TabsTrigger>
          <TabsTrigger value="reports">Счета и документы</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ClientOverviewTab />
        </TabsContent>
        <TabsContent value="payment-methods">
          <ClientPaymentMethodsTab />
        </TabsContent>
        <TabsContent value="reports">
          <ClientReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
