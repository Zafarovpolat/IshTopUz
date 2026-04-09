import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceivedOffersTab } from "@/components/dashboard/offers/client/received-offers-tab";
import { SentInvitationsTab } from "@/components/dashboard/offers/client/sent-invitations-tab";
import { SavedFreelancersTab } from "@/components/dashboard/offers/client/saved-freelancers-tab";
import { getProposalsByClient } from "@/app/actions";
import { getInvitationsSentByClient } from "@/app/dashboard/invitations/actions";
import { getSavedFreelancers } from "@/app/dashboard/saved/actions";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

async function enrichSentInvitations(raw: Awaited<ReturnType<typeof getInvitationsSentByClient>>) {
  if (raw.length === 0) return [];
  const db = getFirestore(getAdminApp());
  return Promise.all(
    raw.map(async (inv: any) => {
      const [fDoc, pDoc] = await Promise.all([
        db.collection("users").doc(inv.freelancerId).get(),
        db.collection("projects").doc(inv.projectId).get(),
      ]);
      const f = fDoc.data();
      const p = pDoc.data();
      return {
        id: inv.id,
        freelancerId: inv.freelancerId,
        freelancerName: f ? `${f.profile?.firstName ?? ""} ${f.profile?.lastName ?? ""}`.trim() || "Фрилансер" : "Фрилансер",
        freelancerAvatar: f?.profile?.avatar ?? "",
        projectId: inv.projectId,
        projectTitle: p?.title ?? "Проект",
        status: inv.status ?? "pending",
        createdAt: inv.createdAt?.toDate?.()?.toISOString?.() ?? inv.createdAt ?? new Date().toISOString(),
      };
    })
  );
}

async function loadSavedFreelancerDetails(ids: string[]) {
  if (ids.length === 0) return [];
  const db = getFirestore(getAdminApp());
  const docs = await Promise.all(ids.map((id) => db.collection("users").doc(id).get()));
  return docs
    .filter((d) => d.exists)
    .map((d) => {
      const data = d.data()!;
      return {
        id: d.id,
        name: `${data.profile?.firstName ?? ""} ${data.profile?.lastName ?? ""}`.trim() || "Фрилансер",
        avatar: data.profile?.avatar ?? "",
        title: data.freelancerProfile?.title ?? "",
        rating: data.freelancerProfile?.rating ?? 0,
        reviewsCount: data.freelancerProfile?.reviewsCount ?? 0,
        hourlyRate: data.freelancerProfile?.hourlyRate ?? 0,
        skills: data.freelancerProfile?.skills ?? [],
      };
    });
}

export async function ClientOffersPage() {
  const [proposals, rawInvitations, savedIds] = await Promise.all([
    getProposalsByClient(),
    getInvitationsSentByClient(),
    getSavedFreelancers(),
  ]);

  const [sentInvitations, savedFreelancers] = await Promise.all([
    enrichSentInvitations(rawInvitations),
    loadSavedFreelancerDetails(savedIds),
  ]);

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
          <TabsTrigger value="sent">
            Отправленные ({sentInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Избранные ({savedFreelancers.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <ReceivedOffersTab initialProposals={proposals} />
        </TabsContent>
        <TabsContent value="sent">
          <SentInvitationsTab initialInvitations={sentInvitations} />
        </TabsContent>
        <TabsContent value="saved">
          <SavedFreelancersTab initialFreelancers={savedFreelancers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
