
'use client';

import { useState, useEffect } from 'react';
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
import { getProjectsByClientId } from '@/app/actions';
import type { Project } from '@/lib/schema';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export function ClientProjectsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getProjectsByClientId(user.uid)
        .then(data => {
          setProjects(data);
          setIsLoading(false);
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    } else {
        setIsLoading(false);
    }
  }, [user]);
  
  const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed');

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
            {isLoading ? <Loader2 className="mt-4 h-8 w-8 animate-spin" /> : <ClientActiveProjectsTab projects={activeProjects} />}
        </TabsContent>
        <TabsContent value="completed">
            {isLoading ? <Loader2 className="mt-4 h-8 w-8 animate-spin" /> : <ClientCompletedProjectsTab projects={completedProjects} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
