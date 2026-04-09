'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitReview } from '@/app/dashboard/reviews/actions';
import { cn } from '@/lib/utils';

type Props = {
  projectId: string;
  targetUserId: string;
  targetName: string;
  children: React.ReactNode;
};

export function ReviewDialog({ projectId, targetUserId, targetName, children }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function onSubmit() {
    if (rating === 0) {
      toast({ variant: 'destructive', title: 'Выберите оценку' });
      return;
    }
    if (comment.length < 10) {
      toast({ variant: 'destructive', title: 'Комментарий слишком короткий (мин. 10 символов)' });
      return;
    }
    startTransition(async () => {
      const res = await submitReview({ projectId, targetUserId, rating, comment });
      if (res.success) {
        toast({ title: 'Спасибо!', description: res.message });
        setOpen(false);
        setRating(0);
        setComment('');
      } else {
        toast({ variant: 'destructive', title: 'Ошибка', description: res.message ?? '' });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
          <DialogDescription>
            Оцените работу с {targetName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                onMouseEnter={() => setHover(v)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    (hover || rating) >= v
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/40'
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {rating === 1 && 'Плохо'}
              {rating === 2 && 'Ниже среднего'}
              {rating === 3 && 'Нормально'}
              {rating === 4 && 'Хорошо'}
              {rating === 5 && 'Отлично'}
            </p>
          )}
          <Textarea
            placeholder="Расскажите о своём опыте работы..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <p className="text-xs text-muted-foreground text-right">{comment.length}/1000</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Отмена
          </Button>
          <Button onClick={onSubmit} disabled={isPending || rating === 0}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Отправить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
