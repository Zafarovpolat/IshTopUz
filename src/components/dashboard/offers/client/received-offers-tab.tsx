"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import Link from "next/link";
import { getProposalsByClient } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";

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

export function ReceivedOffersTab() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<ProposalWithFreelancer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProposalsByClient(user.uid);
        setProposals(data as ProposalWithFreelancer[]);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProposals();
  }, [user]);

  // Функция для форматирования даты
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

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 mt-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">Заявок пока нет</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Как только фрилансеры откликнутся на ваши проекты, вы увидите их заявки здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Заявка на проект:</CardDescription>
                <CardTitle className="text-lg hover:underline">
                  <Link href={`/marketplace/jobs/${proposal.projectId}`}>
                    {proposal.projectTitle}
                  </Link>
                </CardTitle>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  {proposal.bidAmount.toLocaleString('ru-RU')} UZS
                </p>
                <p className="text-sm text-muted-foreground">
                  {getRelativeTime(proposal.createdAt)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Срок: {proposal.bidDuration} дн.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={proposal.freelancerAvatar} />
                <AvatarFallback>
                  {proposal.freelancerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{proposal.freelancerName}</p>
                <p className="text-sm text-muted-foreground">{proposal.freelancerTitle || 'Фрилансер'}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{proposal.freelancerRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="border-l-2 pl-3">
              <p className="text-sm text-muted-foreground italic">
                "{proposal.coverLetter}"
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Принять и нанять</Button>
            <Button variant="outline" className="w-full">Написать в чат</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}