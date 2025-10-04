
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const completedProjects = [
    {
        id: 1,
        title: "Перевод документации",
        client: "Иван Петров",
        budget: "1,500,000 UZS",
        completedDate: "15 июля 2024",
        myFeedback: true,
        clientFeedback: false,
    },
    {
        id: 2,
        title: "Написание 10 статей для блога",
        client: "Marketing Solutions LLC",
        budget: "2,000,000 UZS",
        completedDate: "2 июня 2024",
        myFeedback: true,
        clientFeedback: true,
    },
];

export function CompletedProjectsTab() {
    if (completedProjects.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">У вас еще нет завершенных проектов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Как только вы завершите свой первый проект, он появится здесь.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {completedProjects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>Заказчик: {project.client}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center">
                 <Badge variant="secondary">Завершен: {project.completedDate}</Badge>
                 <span className="text-lg font-bold">{project.budget}</span>
            </div>
            <div className="flex items-center gap-2">
                 <p className="text-sm text-muted-foreground">Ваш отзыв:</p>
                 {project.myFeedback ? <Badge>Оставлен</Badge> : <Badge variant="outline">Не оставлен</Badge>}
            </div>
             <div className="flex items-center gap-2">
                 <p className="text-sm text-muted-foreground">Отзыв заказчика:</p>
                 {project.clientFeedback ? <Badge>Оставлен</Badge> : <Badge variant="outline">Не оставлен</Badge>}
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={!project.clientFeedback} variant="outline" className="w-full">
                <Star className="mr-2 h-4 w-4" />
                Оставить отзыв
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
