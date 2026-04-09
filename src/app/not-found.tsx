import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">Страница не найдена</p>
      <Button asChild>
        <Link href="/">На главную</Link>
      </Button>
    </div>
  );
}
