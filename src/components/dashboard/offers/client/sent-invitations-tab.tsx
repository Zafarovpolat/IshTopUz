"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SentInvitation = {
  id: string;
  freelancerId: string;
  freelancerName?: string;
  freelancerAvatar?: string;
  projectId: string;
  projectTitle?: string;
  status: string;
  createdAt: string;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Ожидает", variant: "outline" },
  accepted: { label: "Принято", variant: "default" },
  declined: { label: "Отклонено", variant: "destructive" },
};

export function SentInvitationsTab({
  initialInvitations,
}: {
  initialInvitations: SentInvitation[];
}) {
  if (initialInvitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Нет отправленных приглашений
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Приглашайте фрилансеров напрямую через их профили.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Исполнитель</TableHead>
            <TableHead>Проект</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialInvitations.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={inv.freelancerAvatar} />
                    <AvatarFallback>{inv.freelancerName?.charAt(0) ?? "?"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{inv.freelancerName ?? "Фрилансер"}</span>
                </div>
              </TableCell>
              <TableCell>{inv.projectTitle ?? inv.projectId}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(inv.createdAt).toLocaleDateString("ru-RU")}
              </TableCell>
              <TableCell>
                <Badge variant={statusMap[inv.status]?.variant ?? "outline"}>
                  {statusMap[inv.status]?.label ?? inv.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
