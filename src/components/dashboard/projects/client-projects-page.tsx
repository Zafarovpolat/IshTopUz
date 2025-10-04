
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { CreateProjectForm } from './create-project-form';
import { ClientActiveProjectsTab } from './client-active-projects-tab';
import { ClientCompletedProjectsTab } from './client-completed-projects-tab';

export function ClientProjectsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
          <p className="text-muted-foreground">
            Управляйте вашими проектами и находите лучших исполнителей.
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Создать новый проект
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Новый проект</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onFormSubmit={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-sm">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            <ClientActiveProjectsTab />
        </TabsContent>
        <TabsContent value="completed">
            <ClientCompletedProjectsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
