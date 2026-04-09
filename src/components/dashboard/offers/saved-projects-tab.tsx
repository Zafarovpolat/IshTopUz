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
import { Badge } from "@/components/ui/badge";
import { BookmarkX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { unsaveEntity } from "@/app/dashboard/saved/actions";

type SavedProject = {
  id: string;
  title: string;
  budgetAmount: number;
  budgetType: string;
  skills: string[];
};

export function SavedProjectsTab({
  initialProjects,
}: {
  initialProjects: SavedProject[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { toast } = useToast();

  function handleUnsave(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const res = await unsaveEntity("project", id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast({ title: "Удалено из сохранённых" });
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message });
      }
      setPendingId(null);
    });
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">Нет сохранённых проектов</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Сохраняйте интересные проекты, чтобы вернуться к ним позже.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/jobs">Найти проекты</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="text-lg hover:text-primary transition-colors">
              <Link href={`/marketplace/jobs/${project.id}`}>{project.title}</Link>
            </CardTitle>
            <CardDescription>
              Бюджет: {project.budgetAmount.toLocaleString("ru-RU")} UZS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.skills.slice(0, 4).map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild className="w-full">
              <Link href={`/marketplace/jobs/${project.id}`}>Подробнее</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleUnsave(project.id)}
              disabled={isPending}
            >
              {pendingId === project.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkX className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
