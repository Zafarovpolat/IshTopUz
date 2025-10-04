
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

const activeProjects = [
    {
        id: 1,
        title: "Разработка логотипа для кофейни",
        freelancerName: 'Алиса В.',
        freelancerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
        budget: "2,500,000 UZS",
        progress: 40,
        deadline: "через 5 дней",
    },
    {
        id: 2,
        title: "Лендинг для онлайн-школы",
        freelancerName: "Максим П.",
        freelancerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
        budget: "5,000,000 UZS",
        progress: 80,
        deadline: "через 12 дней",
    },
];

export function ClientActiveProjectsTab() {
    if (activeProjects.length === 0) {
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
      {activeProjects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={project.freelancerAvatar} />
                    <AvatarFallback>{project.freelancerName.charAt(0)}</AvatarFallback>
                </Avatar>
                Исполнитель: {project.freelancerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Прогресс выполнения</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>
            <div className="flex justify-between items-center">
                 <Badge variant="outline">Срок сдачи: {project.deadline}</Badge>
                 <span className="text-lg font-bold text-primary">{project.budget}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Перейти к проекту</Button>
            <Button variant="outline" className="w-full">Чат с исполнителем</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
