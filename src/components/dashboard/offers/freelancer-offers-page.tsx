
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SentOffersTab } from "@/components/dashboard/offers/sent-offers-tab";
import { InvitationsTab } from "@/components/dashboard/offers/invitations-tab";
import { SavedProjectsTab } from "@/components/dashboard/offers/saved-projects-tab";

export function FreelancerOffersPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Предложения и Заявки</h1>
            <p className="text-muted-foreground">
                Отслеживайте ваши заявки, приглашения и избранные проекты.
            </p>
        </div>
      <Tabs defaultValue="sent">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="sent">Отправленные</TabsTrigger>
          <TabsTrigger value="invitations">Приглашения</TabsTrigger>
          <TabsTrigger value="saved">Избранные</TabsTrigger>
        </TabsList>
        <TabsContent value="sent">
            <SentOffersTab />
        </TabsContent>
        <TabsContent value="invitations">
            <InvitationsTab />
        </TabsContent>
        <TabsContent value="saved">
            <SavedProjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
