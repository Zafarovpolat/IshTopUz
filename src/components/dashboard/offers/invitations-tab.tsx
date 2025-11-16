
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const invitations = [
    {
        id: 1,
        projectTitle: "Создать дизайн для мобильного банка",
        clientName: "Асакабанк",
        clientAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        message: "Здравствуйте! Увидели ваше портфолио, очень впечатлило. Хотели бы пригласить вас поработать над нашим новым мобильным приложением.",
        date: "2 дня назад"
    },
    {
        id: 2,
        projectTitle: "Разработать логотип для кофейни",
        clientName: "Алиса В.",
        clientAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
        message: "Добрый день! Ищем талантливого дизайнера для создания лого. Ваш стиль нам подходит.",
        date: "5 дней назад"
    },
];

export function InvitationsTab() {
    if (invitations.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Приглашений пока нет</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Когда заказчики пригласят вас в проекты, вы увидите это здесь.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {invitations.map((invite) => (
        <Card key={invite.id}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar>
                    <AvatarImage src={invite.clientAvatar} />
                    <AvatarFallback>{invite.clientName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{invite.projectTitle}</CardTitle>
                    </div>
                    <CardDescription>От: {invite.clientName} • {invite.date}</CardDescription>
                </div>
            </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{invite.message}"</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Принять</Button>
            <Button variant="outline" className="w-full">Отклонить</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
