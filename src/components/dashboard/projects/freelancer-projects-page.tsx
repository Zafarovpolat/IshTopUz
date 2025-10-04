
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveProjectsTab } from "@/components/dashboard/projects/active-projects-tab";
import { CompletedProjectsTab } from "@/components/dashboard/projects/completed-projects-tab";
import { DraftsTab } from "@/components/dashboard/projects/drafts-tab";

export function FreelancerProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
        <p className="text-muted-foreground">
          Управляйте вашими текущими и завершенными проектами.
        </p>
      </div>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
          <TabsTrigger value="drafts">Черновики</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ActiveProjectsTab />
        </TabsContent>
        <TabsContent value="completed">
          <CompletedProjectsTab />
        </TabsContent>
        <TabsContent value="drafts">
          <DraftsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
