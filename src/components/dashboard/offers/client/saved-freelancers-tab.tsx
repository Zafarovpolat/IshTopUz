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
import { Star, BookmarkX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { unsaveEntity } from "@/app/dashboard/saved/actions";

type SavedFreelancer = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  skills: string[];
};

export function SavedFreelancersTab({
  initialFreelancers,
}: {
  initialFreelancers: SavedFreelancer[];
}) {
  const [freelancers, setFreelancers] = useState(initialFreelancers);
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { toast } = useToast();

  function handleUnsave(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const res = await unsaveEntity("freelancer", id);
      if (res.success) {
        setFreelancers((prev) => prev.filter((f) => f.id !== id));
        toast({ title: "Удалено из избранных" });
      } else {
        toast({ variant: "destructive", title: "Ошибка", description: res.message });
      }
      setPendingId(null);
    });
  }

  if (freelancers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Нет избранных исполнителей
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Сохраняйте понравившихся фрилансеров для быстрого доступа.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/talents">Найти исполнителей</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 mt-4 md:grid-cols-2">
      {freelancers.map((f) => (
        <Card key={f.id}>
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={f.avatar} />
              <AvatarFallback>{f.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg hover:text-primary transition-colors">
                <Link href={`/talents/${f.id}`}>{f.name}</Link>
              </CardTitle>
              <CardDescription>{f.title || "Фрилансер"}</CardDescription>
              {f.rating > 0 && (
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{f.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({f.reviewsCount})</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {f.hourlyRate > 0 && (
              <p className="text-sm text-muted-foreground">
                {f.hourlyRate.toLocaleString("ru-RU")} UZS/час
              </p>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild className="w-full">
              <Link href={`/talents/${f.id}`}>Профиль</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleUnsave(f.id)}
              disabled={isPending}
            >
              {pendingId === f.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkX className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
