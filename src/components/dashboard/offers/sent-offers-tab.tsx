"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getProposalsByFreelancer } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
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

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
    submitted: { label: "Отправлено", variant: "outline" },
    viewed: { label: "Просмотрено", variant: "secondary" },
    accepted: { label: "Принято", variant: "default" },
    rejected: { label: "Отклонено", variant: "destructive" },
};

export function SentOffersTab() {
    const { user } = useAuth();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProposals() {
            if (!user?.uid) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await getProposalsByFreelancer(user.uid);
                setProposals(data as Proposal[]);
            } catch (error) {
                console.error("Failed to fetch proposals:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProposals();
    }, [user]);

    if (isLoading) {
        return (
            <Card className="mt-4">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Вы еще не отправляли заявок</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Найдите интересный проект и отправьте свое предложение.
                </p>
                <Button className="mt-4" asChild>
                    <Link href="/jobs">Найти проект</Link>
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
                            <TableHead>Дата отправки</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Предложенный бюджет</TableHead>
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
                                </TableCell>
                                <TableCell>
                                    {new Date(proposal.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusMap[proposal.status]?.variant || "outline"}>
                                        {statusMap[proposal.status]?.label || proposal.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {proposal.bidAmount.toLocaleString('ru-RU')} UZS
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}