import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SentOffersTab } from "@/components/dashboard/offers/sent-offers-tab";
import { InvitationsTab } from "@/components/dashboard/offers/invitations-tab";
import { SavedProjectsTab } from "@/components/dashboard/offers/saved-projects-tab";
import { getProposalsByFreelancer } from "@/app/actions";
import { getInvitationsForFreelancer } from "@/app/dashboard/invitations/actions";
import { getSavedProjects } from "@/app/dashboard/saved/actions";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

async function loadSavedProjectDetails(ids: string[]) {
  if (ids.length === 0) return [];
  const db = getFirestore(getAdminApp());
  const docs = await Promise.all(
    ids.map((id) => db.collection("projects").doc(id).get())
  );
  return docs
    .filter((d) => d.exists)
    .map((d) => {
      const data = d.data()!;
      return {
        id: d.id,
        title: data.title ?? "",
        budgetAmount: data.budgetAmount ?? 0,
        budgetType: data.budgetType ?? "fixed",
        skills: data.skills ?? [],
      };
    });
}

async function enrichInvitations(raw: Awaited<ReturnType<typeof getInvitationsForFreelancer>>) {
  if (raw.length === 0) return [];
  const db = getFirestore(getAdminApp());
  return Promise.all(
    raw.map(async (inv) => {
      const [clientDoc, projectDoc] = await Promise.all([
        db.collection("users").doc(inv.clientId).get(),
        db.collection("projects").doc(inv.projectId).get(),
      ]);
      const client = clientDoc.data();
      const project = projectDoc.data();
      return {
        ...inv,
        clientName: client
          ? `${client.profile?.firstName ?? ""} ${client.profile?.lastName ?? ""}`.trim() || "Заказчик"
          : "Заказчик",
        clientAvatar: client?.profile?.avatar ?? "",
        projectTitle: project?.title ?? "Проект",
      };
    })
  );
}

export async function FreelancerOffersPage() {
  const [proposals, rawInvitations, savedIds] = await Promise.all([
    getProposalsByFreelancer(),
    getInvitationsForFreelancer(),
    getSavedProjects(),
  ]);

  const [invitations, savedProjects] = await Promise.all([
    enrichInvitations(rawInvitations),
    loadSavedProjectDetails(savedIds),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Предложения и Заявки
        </h1>
        <p className="text-muted-foreground">
          Отслеживайте ваши заявки, приглашения и избранные проекты.
        </p>
      </div>
      <Tabs defaultValue="sent">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="sent">
            Отправленные ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Приглашения ({invitations.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Избранные ({savedProjects.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sent">
          <SentOffersTab initialProposals={proposals} />
        </TabsContent>
        <TabsContent value="invitations">
          <InvitationsTab initialInvitations={invitations} />
        </TabsContent>
        <TabsContent value="saved">
          <SavedProjectsTab initialProjects={savedProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
