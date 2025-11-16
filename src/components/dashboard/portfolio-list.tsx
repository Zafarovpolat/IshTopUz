
'use client';

import type { PortfolioItem } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { Trash2, ExternalLink } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deletePortfolioItem } from '@/app/actions';
import Link from 'next/link';

export function PortfolioList({ initialItems, userId }: { initialItems: PortfolioItem[], userId: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = (itemId: string) => {
        startTransition(async () => {
            const result = await deletePortfolioItem(userId, itemId);
            if (result.success) {
                toast({ title: 'Успешно!', description: result.message });
            } else {
                toast({ variant: 'destructive', title: 'Ошибка', description: result.message });
            }
        });
    }

    if (initialItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center">
                <h3 className="text-xl font-semibold tracking-tight">Ваше портфолио пока пусто</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Добавьте свои лучшие работы, чтобы продемонстрировать свои навыки клиентам.
                </p>
            </div>
        );
    }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {initialItems.map((item) => (
        <Card key={item.id} className="group flex flex-col overflow-hidden">
          <CardHeader className="p-0">
             <div className="relative h-48 w-full">
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                />
                 {item.projectUrl && (
                  <Link href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="icon" className="absolute top-2 right-2 h-8 w-8 z-10">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
             </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="mb-2 text-lg">{item.title}</CardTitle>
            <CardDescription className="line-clamp-3">{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
             <div className="flex flex-wrap gap-2">
                {Array.isArray(item.technologies) && item.technologies.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
             </div>
             <div className="w-full flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя будет отменить. Эта работа будет навсегда удалена из вашего портфолио.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => handleDelete(item.id)}
                            disabled={isPending}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isPending ? "Удаление..." : "Удалить"}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
             </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
