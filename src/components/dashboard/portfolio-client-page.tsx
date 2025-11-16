
'use client';

import { useState } from 'react';
import type { PortfolioItem } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PortfolioForm } from './portfolio-form';
import { PortfolioList } from './portfolio-list';

export function PortfolioClientPage({
  initialItems,
  userId,
}: {
  initialItems: PortfolioItem[];
  userId: string;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Портфолио</h1>
          <p className="text-muted-foreground">
            Управляйте вашими лучшими работами, чтобы привлекать клиентов.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить работу
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Новая работа в портфолио</DialogTitle>
            </DialogHeader>
            <PortfolioForm userId={userId} onFormSubmit={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <PortfolioList initialItems={initialItems} userId={userId} />
    </div>
  );
}
