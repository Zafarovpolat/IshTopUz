
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Project } from "@/lib/schema";

// Mock data for freelancer, this should come from a separate query
const mockFreelancers: { [key: string]: { name: string, avatar: string } } = {
    '1': { name: 'Алиса В.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
    '2': { name: 'Максим П.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
};


export function ClientActiveProjectsTab({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Нет активных проектов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Когда вы наймете исполнителя, ваш проект появится здесь.
                </p>
                <Button className="mt-4">Создать проект</Button>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {projects.map((project) => {
        const freelancer = project.freelancerId ? mockFreelancers[project.freelancerId] : null;
        const progress = project.status === 'in_progress' ? 50 : 10; // Placeholder progress
        const deadline = project.deadline ? new Date(project.deadline).toLocaleDateString('ru-RU') : 'не указан';

        return (
            <Card key={project.id}>
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                {freelancer ? (
                    <CardDescription className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={freelancer.avatar} />
                            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        Исполнитель: {freelancer.name}
                    </CardDescription>
                ) : (
                    <CardDescription>Исполнитель еще не назначен</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Прогресс выполнения</span>
                    <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
                </div>
                <div className="flex justify-between items-center">
                    <Badge variant="outline">Срок сдачи: {deadline}</Badge>
                    <span className="text-lg font-bold text-primary">{project.budgetAmount.toLocaleString('ru-RU')} UZS</span>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button className="w-full">Перейти к проекту</Button>
                {freelancer && <Button variant="outline" className="w-full">Чат с исполнителем</Button>}
            </CardFooter>
            </Card>
        )
        })}
    </div>
  );
}
