"use client";

import { useTransition, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/app/dashboard/messages/actions";

type FreelancerProject = {
  id: string;
  title: string;
  status: string;
  budgetAmount: number;
  clientName: string;
  clientAvatar: string;
  clientId: string;
  deadline?: string;
  skills: string[];
};

export function FreelancerActiveProjectsTab({
  projects,
}: {
  projects: FreelancerProject[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingChat, setPendingChat] = useState<string | null>(null);

  function handleChat(clientId: string) {
    setPendingChat(clientId);
    startTransition(async () => {
      const res = await getOrCreateConversation(clientId);
      if (res.success && res.conversationId) {
        router.push(`/dashboard/messages?id=${res.conversationId}`);
      }
      setPendingChat(null);
    });
  }
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Нет активных проектов
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Найдите свой следующий проект в разделе "Биржа".
        </p>
        <Button className="mt-4" asChild>
          <Link href="/marketplace">Найти работу</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => {
        // Определяем прогресс по статусу
        let progress = 0;
        let progressLabel = "Начало работы";

        if (project.status === "in_progress") {
          progress = 50;
          progressLabel = "В работе";
        } else if (project.status === "completed") {
          progress = 100;
          progressLabel = "Завершен";
        }

        const deadline = project.deadline
          ? new Date(project.deadline).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })
          : null;

        return (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="hover:text-primary transition-colors">
                <Link href={`/marketplace/jobs/${project.id}`}>
                  {project.title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={project.clientAvatar} />
                  <AvatarFallback>
                    {project.clientName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                Заказчик: {project.clientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    {progressLabel}
                  </span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="flex justify-between items-center">
                {deadline && <Badge variant="outline">Срок: {deadline}</Badge>}
                <span className="text-lg font-bold text-primary ml-auto">
                  {project.budgetAmount.toLocaleString("ru-RU")} UZS
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="w-full">
                <Link href={`/marketplace/jobs/${project.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Перейти к проекту
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleChat(project.clientId)}
                disabled={isPending}
              >
                {pendingChat === project.clientId ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                Чат с заказчиком
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
