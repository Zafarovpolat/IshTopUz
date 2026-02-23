"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Proposal = {
  id: string;
  projectId: string;
  projectTitle: string;
  bidAmount: number;
  bidDuration: number;
  status: string;
  createdAt: string;
};

const statusMap: {
  [key: string]: {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  };
} = {
  submitted: { label: "Отправлено", variant: "outline" },
  viewed: { label: "Просмотрено", variant: "secondary" },
  accepted: { label: "Принято", variant: "default" },
  rejected: { label: "Отклонено", variant: "destructive" },
};

// ✅ Props вместо useAuth — данные приходят с сервера
type SentOffersTabProps = {
  initialProposals: Proposal[];
};

export function SentOffersTab({ initialProposals }: SentOffersTabProps) {
  const [proposals] = useState<Proposal[]>(initialProposals);

  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Вы еще не отправляли заявок
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Найдите интересный проект и отправьте свое предложение.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/marketplace">Найти проект</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Проект</TableHead>
              <TableHead className="hidden sm:table-cell">
                Дата отправки
              </TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Ставка</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/marketplace/jobs/${proposal.projectId}`}
                    className="hover:underline"
                  >
                    {proposal.projectTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {new Date(proposal.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(proposal.createdAt).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusMap[proposal.status]?.variant || "outline"}
                  >
                    {statusMap[proposal.status]?.label || proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    {proposal.bidAmount.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-muted-foreground text-sm"> UZS</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
