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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ReviewDialog } from "@/components/dashboard/review-dialog";

type FreelancerProject = {
  id: string;
  title: string;
  status: string;
  budgetAmount: number;
  clientName: string;
  clientAvatar: string;
  clientId: string;
  completedAt?: string;
  skills: string[];
};

export function FreelancerCompletedProjectsTab({
  projects,
}: {
  projects: FreelancerProject[];
}) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          У вас еще нет завершенных проектов
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Как только вы завершите свой первый проект, он появится здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => {
        const completedDate = project.completedAt
          ? new Date(project.completedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Дата не указана";

        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
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
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
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
              <ReviewDialog
                projectId={project.id}
                targetUserId={project.clientId}
                targetName={project.clientName}
              >
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Оставить отзыв
                </Button>
              </ReviewDialog>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
