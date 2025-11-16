
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

const draftProposals = [
    {
        id: 1,
        title: "Нужен копирайтер для блога",
        client: "Tech Innovations Inc.",
        budget: "до 2,000,000 UZS",
        savedDate: "2 дня назад",
    },
];

export function DraftsTab() {
    if (draftProposals.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">У вас нет черновиков</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Вы можете сохранять заявки на проекты, чтобы вернуться к ним позже.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {draftProposals.map((draft) => (
        <Card key={draft.id}>
          <CardHeader>
            <CardTitle>{draft.title}</CardTitle>
            <CardDescription>Заказчик: {draft.client}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center">
                 <Badge variant="outline">Сохранено: {draft.savedDate}</Badge>
                 <span className="font-semibold">{draft.budget}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Завершить и отправить</Button>
            <Button variant="destructive" className="w-full">Удалить черновик</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
