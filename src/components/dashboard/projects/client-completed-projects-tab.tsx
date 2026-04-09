"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ReviewDialog } from "@/components/dashboard/review-dialog";

type CompletedProject = {
  id: string;
  title: string;
  budgetAmount: number;
  completedAt?: string;
  freelancerId?: string;
  freelancerName?: string;
  freelancerAvatar?: string;
};

export function ClientCompletedProjectsTab({
  projects,
}: {
  projects: CompletedProject[];
}) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          У вас еще нет завершенных проектов
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          История ваших успешно выполненных проектов будет здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => {
        const completedDate = project.completedAt
          ? new Date(project.completedAt).toLocaleDateString("ru-RU")
          : "неизвестно";

        return (
          <Card key={project.id}>
            <CardHeader>
              <Link href={`/marketplace/jobs/${project.id}`}>
                <CardTitle className="hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </Link>
              {project.freelancerName ? (
                <CardDescription className="flex items-center gap-2 pt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={project.freelancerAvatar} />
                    <AvatarFallback>
                      {project.freelancerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  Исполнитель: {project.freelancerName}
                </CardDescription>
              ) : (
                <CardDescription>Исполнитель не указан</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Завершен: {completedDate}</Badge>
                <span className="text-lg font-bold">
                  {project.budgetAmount.toLocaleString("ru-RU")} UZS
                </span>
              </div>
            </CardContent>
            <CardFooter>
              {project.freelancerId ? (
                <ReviewDialog
                  projectId={project.id}
                  targetUserId={project.freelancerId}
                  targetName={project.freelancerName ?? "Исполнитель"}
                >
                  <Button className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    Оставить отзыв
                  </Button>
                </ReviewDialog>
              ) : (
                <Button className="w-full" disabled>
                  <Star className="mr-2 h-4 w-4" />
                  Оставить отзыв
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
