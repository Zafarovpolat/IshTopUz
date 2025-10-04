
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
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";

const receivedOffers = [
    {
        id: 1,
        projectTitle: "Разработка логотипа для кофейни",
        freelancerName: "Алиса Воронова",
        freelancerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
        freelancerRating: 4.9,
        coverLetter: "Здравствуйте! Очень интересный проект, с радостью взялась бы за него. В моем портфолио есть похожие работы. Предлагаю обсудить детали в чате.",
        bid: "2,500,000 UZS",
        receivedDate: "1 час назад"
    },
    {
        id: 2,
        projectTitle: "Разработка логотипа для кофейни",
        freelancerName: "Сергей Грачев",
        freelancerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
        freelancerRating: 4.7,
        coverLetter: "Добрый день. Готов выполнить ваш заказ. Сделаю 3 варианта на выбор.",
        bid: "2,200,000 UZS",
        receivedDate: "3 часа назад"
    },
];

export function ReceivedOffersTab() {
    if (receivedOffers.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Заявок пока нет</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Как только фрилансеры откликнутся на ваши проекты, вы увидите их заявки здесь.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4">
      {receivedOffers.map((offer) => (
        <Card key={offer.id}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardDescription>Заявка на проект:</CardDescription>
                        <CardTitle className="text-lg hover:underline"><Link href="/dashboard/projects/1">{offer.projectTitle}</Link></CardTitle>
                    </div>
                     <div className="text-right">
                        <p className="text-xl font-bold">{offer.bid}</p>
                        <p className="text-sm text-muted-foreground">{offer.receivedDate}</p>
                    </div>
                </div>
            </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 rounded-lg border p-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={offer.freelancerAvatar} />
                    <AvatarFallback>{offer.freelancerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{offer.freelancerName}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{offer.freelancerRating}</span>
                    </div>
                </div>
             </div>
            <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{offer.coverLetter}"</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="w-full">Принять и нанять</Button>
            <Button variant="outline" className="w-full">Написать в чат</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
