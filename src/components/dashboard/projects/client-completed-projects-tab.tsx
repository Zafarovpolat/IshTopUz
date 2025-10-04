
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
import { Star, RefreshCw } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const completedProjects = [
    {
        id: 1,
        title: "Верстка главной страницы сайта",
        freelancerName: "Тимур Ибрагимов",
        freelancerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        budget: "1,500,000 UZS",
        completedDate: "15 июля 2024",
        feedbackGiven: true,
    },
    {
        id: 2,
        title: "Написание 10 статей для блога",
        freelancerName: "Елена Соколова",
        freelancerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
        budget: "2,000,000 UZS",
        completedDate: "2 июня 2024",
        feedbackGiven: false,
    },
];

export function ClientCompletedProjectsTab() {
    if (completedProjects.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">У вас еще нет завершенных проектов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    История ваших успешно выполненных проектов будет здесь.
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
            <CardDescription className="flex items-center gap-2 pt-1">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={project.freelancerAvatar} />
                    <AvatarFallback>{project.freelancerName.charAt(0)}</AvatarFallback>
                </Avatar>
                Исполнитель: {project.freelancerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center">
                 <Badge variant="secondary">Завершен: {project.completedDate}</Badge>
                 <span className="text-lg font-bold">{project.budget}</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Нанять снова
            </Button>
            <Button disabled={project.feedbackGiven} className="w-full">
                <Star className="mr-2 h-4 w-4" />
                {project.feedbackGiven ? 'Отзыв оставлен' : 'Оставить отзыв'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
