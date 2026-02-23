import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceivedOffersTab } from "@/components/dashboard/offers/client/received-offers-tab";
import { SentInvitationsTab } from "@/components/dashboard/offers/client/sent-invitations-tab";
import { SavedFreelancersTab } from "@/components/dashboard/offers/client/saved-freelancers-tab";
import { getProposalsByClient } from "@/app/actions";

// ✅ Серверный компонент — убрали 'use client'
export async function ClientOffersPage() {
  // ✅ Убрали userId — получается на сервере в actions
  const proposals = await getProposalsByClient();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Предложения и Приглашения
        </h1>
        <p className="text-muted-foreground">
          Управляйте заявками на ваши проекты и приглашениями для фрилансеров.
        </p>
      </div>
      <Tabs defaultValue="received">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="received">
            Полученные ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="sent">Отправленные</TabsTrigger>
          <TabsTrigger value="saved">Избранные</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <ReceivedOffersTab initialProposals={proposals} />
        </TabsContent>
        <TabsContent value="sent">
          <SentInvitationsTab />
        </TabsContent>
        <TabsContent value="saved">
          <SavedFreelancersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
