"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { acceptProposal, rejectProposal } from "@/app/actions";
import { getOrCreateConversation } from "@/app/dashboard/messages/actions";

type ProposalWithFreelancer = {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerRating: number;
  freelancerTitle: string;
  bidAmount: number;
  bidDuration: number;
  coverLetter: string;
  status: string;
  createdAt: string;
};

const statusMap: {
  [key: string]: {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  };
} = {
  submitted: { label: "Новая", variant: "outline" },
  viewed: { label: "Просмотрено", variant: "secondary" },
  accepted: { label: "Принято", variant: "default" },
  rejected: { label: "Отклонено", variant: "destructive" },
};

type ReceivedOffersTabProps = {
  initialProposals: ProposalWithFreelancer[];
};

export function ReceivedOffersTab({ initialProposals }: ReceivedOffersTabProps) {
  const [proposals, setProposals] = useState<ProposalWithFreelancer[]>(initialProposals);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  function handleAccept(proposal: ProposalWithFreelancer) {
    setPendingAction(`accept-${proposal.id}`);
    startTransition(async () => {
      const res = await acceptProposal(proposal.projectId, proposal.id);
      if (res.success) {
        toast({ title: "Готово", description: res.message });
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposal.id
              ? { ...p, status: "accepted" }
              : p.projectId === proposal.projectId
              ? { ...p, status: "rejected" }
              : p
          )
        );
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message });
      }
      setPendingAction(null);
    });
  }

  function handleReject(proposal: ProposalWithFreelancer) {
    setPendingAction(`reject-${proposal.id}`);
    startTransition(async () => {
      const res = await rejectProposal(proposal.projectId, proposal.id);
      if (res.success) {
        toast({ title: "Готово", description: res.message });
        setProposals((prev) =>
          prev.map((p) => (p.id === proposal.id ? { ...p, status: "rejected" } : p))
        );
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message });
      }
      setPendingAction(null);
    });
  }

  function handleMessage(freelancerId: string) {
    setPendingAction(`msg-${freelancerId}`);
    startTransition(async () => {
      const res = await getOrCreateConversation(freelancerId);
      if (res.success && res.conversationId) {
        router.push(`/dashboard/messages?id=${res.conversationId}`);
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message ?? "Не удалось открыть чат." });
      }
      setPendingAction(null);
    });
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">Заявок пока нет</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Как только фрилансеры откликнутся на ваши проекты, вы увидите их заявки здесь.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/projects">Создать проект</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4">
      {proposals.map((proposal) => {
        const isAccepted = proposal.status === "accepted";
        const isRejected = proposal.status === "rejected";
        const isActionable = proposal.status === "submitted" || proposal.status === "viewed";

        return (
          <Card key={proposal.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="space-y-1">
                  <CardDescription className="flex items-center gap-2">
                    Заявка на проект
                    <Badge variant={statusMap[proposal.status]?.variant || "outline"} className="text-xs">
                      {statusMap[proposal.status]?.label || proposal.status}
                    </Badge>
                  </CardDescription>
                  <CardTitle className="text-lg">
                    <Link href={`/marketplace/jobs/${proposal.projectId}`} className="hover:underline">
                      {proposal.projectTitle}
                    </Link>
                  </CardTitle>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold text-primary">
                    {proposal.bidAmount.toLocaleString("ru-RU")} UZS
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground sm:justify-end">
                    <Clock className="h-3 w-3" />
                    <span>{proposal.bidDuration} дн.</span>
                    <span className="mx-1">•</span>
                    <span>{getRelativeTime(proposal.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4 bg-muted/30">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={proposal.freelancerAvatar} />
                  <AvatarFallback>
                    {proposal.freelancerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link href={`/talents/${proposal.freelancerId}`} className="font-semibold hover:underline">
                    {proposal.freelancerName}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">
                    {proposal.freelancerTitle || "Фрилансер"}
                  </p>
                  {proposal.freelancerRating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{proposal.freelancerRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-l-2 border-primary/20 pl-4">
                <p className="text-sm text-muted-foreground italic line-clamp-3">
                  &ldquo;{proposal.coverLetter}&rdquo;
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-2 bg-muted/20 pt-4">
              {isActionable && (
                <>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => handleAccept(proposal)}
                    disabled={isPending}
                  >
                    {pendingAction === `accept-${proposal.id}` && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Принять и нанять
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleMessage(proposal.freelancerId)}
                    disabled={isPending}
                  >
                    {pendingAction === `msg-${proposal.freelancerId}` ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Написать
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-destructive hover:text-destructive"
                    onClick={() => handleReject(proposal)}
                    disabled={isPending}
                  >
                    {pendingAction === `reject-${proposal.id}` && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Отклонить
                  </Button>
                </>
              )}
              {isAccepted && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => handleMessage(proposal.freelancerId)}
                  disabled={isPending}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Написать исполнителю
                </Button>
              )}
              {isRejected && (
                <p className="text-sm text-muted-foreground">Отклик отклонён</p>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
