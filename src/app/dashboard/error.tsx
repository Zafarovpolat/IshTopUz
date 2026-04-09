'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h2 className="text-xl font-semibold">Что-то пошло не так</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Произошла ошибка при загрузке раздела. Попробуйте обновить страницу.
      </p>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}
