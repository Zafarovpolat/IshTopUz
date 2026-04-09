"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { respondInvitation } from "@/app/dashboard/invitations/actions";

type Invitation = {
  id: string;
  clientId: string;
  projectId: string;
  message: string;
  status: string;
  createdAt: string;
  clientName?: string;
  clientAvatar?: string;
  projectTitle?: string;
};

export function InvitationsTab({ initialInvitations }: { initialInvitations: Invitation[] }) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { toast } = useToast();

  function handle(id: string, accept: boolean) {
    setPendingId(`${accept ? "a" : "r"}-${id}`);
    startTransition(async () => {
      const res = await respondInvitation(id, accept);
      if (res.success) {
        toast({ title: "Готово", description: res.message });
        setInvitations((prev) => prev.filter((i) => i.id !== id));
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message });
      }
      setPendingId(null);
    });
  }

  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">Приглашений пока нет</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Когда заказчики пригласят вас в проекты, вы увидите это здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {invitations.map((invite) => (
        <Card key={invite.id}>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar>
              <AvatarImage src={invite.clientAvatar} />
              <AvatarFallback>{invite.clientName?.charAt(0) ?? "?"}</AvatarFallback>
            </Avatar>
            <div className="w-full">
              <CardTitle className="text-lg">{invite.projectTitle ?? "Проект"}</CardTitle>
              <CardDescription>
                От: {invite.clientName ?? "Заказчик"} •{" "}
                {new Date(invite.createdAt).toLocaleDateString("ru-RU")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic border-l-2 pl-3">
              &ldquo;{invite.message}&rdquo;
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => handle(invite.id, true)}
              disabled={isPending}
            >
              {pendingId === `a-${invite.id}` && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Принять
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handle(invite.id, false)}
              disabled={isPending}
            >
              {pendingId === `r-${invite.id}` && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Отклонить
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
