"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { ProjectForm } from "./project-form";
import { ClientActiveProjectsTab } from "./client-active-projects-tab";
import { ClientCompletedProjectsTab } from "./client-completed-projects-tab";
import { getProjectsByClientId } from "@/app/actions";
import type { Project } from "@/lib/schema";

export function ClientProjectsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchProjects = () => {
    setIsLoading(true);
    getProjectsByClientId()
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Исправлено: отдельная функция для открытия формы создания
  const handleCreateNew = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  const handleFormSubmit = () => {
    handleFormClose();
    startTransition(() => {
      fetchProjects();
    });
  };

  const activeProjects = projects.filter(
    (p) => p.status === "open" || p.status === "in_progress",
  );
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
          <p className="text-muted-foreground">
            Управляйте вашими проектами и находите лучших исполнителей.
          </p>
        </div>
        {/* ✅ Исправлено: убрали DialogTrigger, используем обычную кнопку */}
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Создать новый проект
        </Button>
      </div>

      {/* ✅ Dialog отдельно от кнопки */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject?.id ? "Редактировать проект" : "Новый проект"}
            </DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={selectedProject}
            onFormSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-sm">
          <TabsTrigger value="active">
            Активные ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Завершенные ({completedProjects.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {isLoading || isPending ? (
            <div className="flex justify-center mt-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ClientActiveProjectsTab
              projects={activeProjects}
              onEdit={handleEdit}
            />
          )}
        </TabsContent>
        <TabsContent value="completed">
          {isLoading || isPending ? (
            <div className="flex justify-center mt-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ClientCompletedProjectsTab projects={completedProjects} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
