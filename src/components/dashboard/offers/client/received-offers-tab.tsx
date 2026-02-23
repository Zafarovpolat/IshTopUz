"use client";

import { useState } from "react";
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
import { Star, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

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

// ✅ Props вместо useAuth — данные приходят с сервера
type ReceivedOffersTabProps = {
  initialProposals: ProposalWithFreelancer[];
};

export function ReceivedOffersTab({
  initialProposals,
}: ReceivedOffersTabProps) {
  const [proposals] = useState<ProposalWithFreelancer[]>(initialProposals);

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

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Заявок пока нет
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Как только фрилансеры откликнутся на ваши проекты, вы увидите их
          заявки здесь.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/projects">Создать проект</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div className="space-y-1">
                <CardDescription className="flex items-center gap-2">
                  Заявка на проект
                  <Badge
                    variant={statusMap[proposal.status]?.variant || "outline"}
                    className="text-xs"
                  >
                    {statusMap[proposal.status]?.label || proposal.status}
                  </Badge>
                </CardDescription>
                <CardTitle className="text-lg">
                  <Link
                    href={`/marketplace/jobs/${proposal.projectId}`}
                    className="hover:underline"
                  >
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
                <Link
                  href={`/talents/${proposal.freelancerId}`}
                  className="font-semibold hover:underline"
                >
                  {proposal.freelancerName}
                </Link>
                <p className="text-sm text-muted-foreground truncate">
                  {proposal.freelancerTitle || "Фрилансер"}
                </p>
                {proposal.freelancerRating > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {proposal.freelancerRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-l-2 border-primary/20 pl-4">
              <p className="text-sm text-muted-foreground italic line-clamp-3">
                "{proposal.coverLetter}"
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 bg-muted/20 pt-4">
            <Button className="w-full sm:w-auto">Принять и нанять</Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <MessageSquare className="h-4 w-4 mr-2" />
              Написать
            </Button>
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-destructive hover:text-destructive"
            >
              Отклонить
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
