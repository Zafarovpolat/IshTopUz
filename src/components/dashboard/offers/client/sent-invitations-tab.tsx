
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sentInvitations = [
    {
        id: 1,
        freelancerName: "Максим Петров",
        freelancerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
        projectTitle: "Лендинг для онлайн-школы",
        sentDate: "2024-08-10",
        status: "accepted",
    },
    {
        id: 2,
        freelancerName: "Тимур Ибрагимов",
        freelancerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
        projectTitle: "Разработка CRM-системы",
        sentDate: "2024-08-09",
        status: "viewed",
    },
     {
        id: 3,
        freelancerName: "Елена Соколова",
        freelancerAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
        projectTitle: "SEO-оптимизация сайта",
        sentDate: "2024-08-08",
        status: "declined",
    },
];

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
    sent: { label: "Отправлено", variant: "outline" },
    viewed: { label: "Просмотрено", variant: "secondary" },
    accepted: { label: "Принято", variant: "default" },
    declined: { label: "Отклонено", variant: "destructive" },
};


export function SentInvitationsTab() {
    if (sentInvitations.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Вы еще не отправляли приглашений</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Найдите подходящего исполнителя в поиске и пригласите его в свой проект.
                </p>
            </div>
        )
    }
  return (
    <Card className="mt-4">
        <CardContent className="p-0">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Исполнитель</TableHead>
                    <TableHead>Проект</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Статус</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sentInvitations.map((invite) => (
                    <TableRow key={invite.id}>
                        <TableCell className="font-medium">
                           <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={invite.freelancerAvatar} alt={invite.freelancerName} />
                                    <AvatarFallback>{invite.freelancerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span>{invite.freelancerName}</span>
                           </div>
                        </TableCell>
                        <TableCell>{invite.projectTitle}</TableCell>
                        <TableCell>{new Date(invite.sentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <Badge variant={statusMap[invite.status].variant}>
                                {statusMap[invite.status].label}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
      </CardContent>
    </Card>
  );
}
