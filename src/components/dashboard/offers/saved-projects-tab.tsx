
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
import { BookmarkX } from "lucide-react";

const savedProjects = [
    {
        id: 1,
        title: "Нужен копирайтер для блога о технологиях",
        budget: "до 2,000,000 UZS",
        skills: ["Копирайтинг", "SEO", "Технологии"],
        savedDate: "1 день назад"
    },
     {
        id: 2,
        title: "Смонтировать 5 видео-роликов для YouTube",
        budget: "3,500,000 UZS",
        skills: ["Adobe Premiere Pro", "Монтаж видео", "Цветокоррекция"],
        savedDate: "4 дня назад"
    },
];

export function SavedProjectsTab() {
    if (savedProjects.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Нет избранных проектов</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Вы можете сохранять интересные проекты, чтобы вернуться к ним позже.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4">
      {savedProjects.map((project) => (
        <Card key={project.id}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <BookmarkX className="h-5 w-5" />
                        <span className="sr-only">Удалить из избранного</span>
                    </Button>
                </div>
                <CardDescription>Сохранено: {project.savedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                 </div>
                 <div className="text-lg font-bold text-primary">{project.budget}</div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full sm:w-auto">Подать заявку</Button>
            </CardFooter>
        </Card>
      ))}
    </div>
  );
}
