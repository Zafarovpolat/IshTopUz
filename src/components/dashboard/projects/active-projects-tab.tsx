
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

const activeProjects = [
    {
        id: 1,
        title: "Разработка SMM-стратегии",
        client: 'ООО "Рога и Копыта"',
        budget: "3,000,000 UZS",
        progress: 75,
        deadline: "через 2 недели",
    },
    {
        id: 2,
        title: "Дизайн лендинга для онлайн-школы",
        client: "Global Education",
        budget: "4,500,000 UZS",
        progress: 30,
        deadline: "через 1 месяц",
    },
];

export function ActiveProjectsTab() {
    if (activeProjects.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Нет активных проектов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Найдите свой следующий проект в разделе "Поиск заказов".
                </p>
                <Button className="mt-4">Найти работу</Button>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {activeProjects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>Заказчик: {project.client}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Прогресс</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>
            <div className="flex justify-between items-center">
                 <Badge variant="outline">Срок: {project.deadline}</Badge>
                 <span className="text-lg font-bold text-primary">{project.budget}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Перейти к проекту</Button>
            <Button variant="outline" className="w-full">Чат с заказчиком</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
