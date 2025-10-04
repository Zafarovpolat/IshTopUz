
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sentOffers = [
    {
        id: 1,
        projectTitle: "Разработка дизайна для сайта e-commerce",
        sentDate: "2024-08-01",
        status: "viewed",
        budget: "5,000,000 UZS"
    },
    {
        id: 2,
        projectTitle: "Написать 5 SEO-статей про туризм в Узбекистане",
        sentDate: "2024-07-28",
        status: "sent",
        budget: "1,500,000 UZS"
    },
     {
        id: 3,
        projectTitle: "Создать анимационный ролик для рекламы",
        sentDate: "2024-07-25",
        status: "accepted",
        budget: "4,000,000 UZS"
    },
];

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" } } = {
    sent: { label: "Отправлено", variant: "outline" },
    viewed: { label: "Просмотрено", variant: "secondary" },
    accepted: { label: "Принято", variant: "default" },
    declined: { label: "Отклонено", variant: "destructive" as any},
};


export function SentOffersTab() {
    if (sentOffers.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Вы еще не отправляли заявок</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Найдите интересный проект и отправьте свое предложение.
                </p>
                 <Button className="mt-4">Найти проект</Button>
            </div>
        )
    }
  return (
    <Card className="mt-4">
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Проект</TableHead>
                <TableHead>Дата отправки</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Предложенный бюджет</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sentOffers.map((offer) => (
                    <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.projectTitle}</TableCell>
                        <TableCell>{new Date(offer.sentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant={statusMap[offer.status].variant}>
                                {statusMap[offer.status].label}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{offer.budget}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
      </CardContent>
    </Card>
  );
}
