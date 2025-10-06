
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
import type { Project } from "@/lib/schema";

// Mock data for freelancer, this should come from a separate query
const mockFreelancers: { [key: string]: { name: string, avatar: string } } = {
    '1': { name: 'Тимур Ибрагимов', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    '2': { name: 'Елена Соколова', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
};

export function ClientCompletedProjectsTab({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
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
      {projects.map((project) => {
         const freelancer = project.freelancerId ? mockFreelancers[project.freelancerId] : null;
         const completedDate = project.completedAt ? new Date(project.completedAt).toLocaleDateString('ru-RU') : 'неизвестно';
         // Placeholder for feedback status
         const feedbackGiven = false; 

         return (
            <Card key={project.id}>
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                {freelancer ? (
                    <CardDescription className="flex items-center gap-2 pt-1">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={freelancer.avatar} />
                            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        Исполнитель: {freelancer.name}
                    </CardDescription>
                ) : <CardDescription>Исполнитель не указан</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <Badge variant="secondary">Завершен: {completedDate}</Badge>
                    <span className="text-lg font-bold">{project.budgetAmount.toLocaleString('ru-RU')} UZS</span>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full" disabled={!freelancer}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Нанять снова
                </Button>
                <Button disabled={feedbackGiven} className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    {feedbackGiven ? 'Отзыв оставлен' : 'Оставить отзыв'}
                </Button>
            </CardFooter>
            </Card>
        )
      })}
    </div>
  );
}
