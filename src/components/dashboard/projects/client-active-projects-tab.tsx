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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Project } from "@/lib/schema";
import Link from "next/link";
import { Edit, Trash2, Loader2, CheckCircle } from "lucide-react";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteProject, completeProject } from "@/app/actions";
import { useRouter } from "next/navigation";

export function ClientActiveProjectsTab({
  projects,
  onEdit,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleComplete = (projectId: string) => {
    startTransition(async () => {
      const result = await completeProject(projectId);
      if (result.success) {
        toast({ title: "Успешно!", description: result.message });
        router.refresh();
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: result.message });
      }
    });
  };

  const handleDelete = (projectId: string) => {
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast({ title: "Успешно!", description: result.message });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.message,
        });
      }
    });
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Нет активных проектов
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Когда вы создадите проект, он появится здесь.
        </p>
        <Button className="mt-4" onClick={() => onEdit({} as Project)}>
          Создать проект
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => {
        let progress = 0;
        if (project.status === "in_progress") {
          progress = 50;
        } else if (project.status === "completed") {
          progress = 100;
        } else if (project.status === "open") {
          progress = 0;
        }

        const deadline = project.deadline
          ? new Date(project.deadline).toLocaleDateString("ru-RU")
          : "не указан";

        return (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="hover:text-primary transition-colors">
                <Link href={`/marketplace/jobs/${project.id}`}>
                  {project.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {project.freelancerId
                  ? "Исполнитель назначен"
                  : "Исполнитель еще не назначен"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    Прогресс выполнения
                  </span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  Откликов: {project.proposalsCount || 0}
                </Badge>
                <span className="text-lg font-bold text-primary">
                  {project.budgetAmount.toLocaleString("ru-RU")} UZS
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 flex-wrap">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/marketplace/jobs/${project.id}`}>Посмотреть</Link>
              </Button>
              {project.status === "in_progress" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Завершить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Завершить проект?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Проект будет отмечен как завершённый. После этого вы сможете оставить отзыв исполнителю.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleComplete(project.id)} disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Завершить"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                onClick={() => onEdit(project)}
                variant="outline"
                size="icon"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить проект?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Проект и все отклики на него
                      будут удалены.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(project.id)}
                      disabled={isPending}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Удалить"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
