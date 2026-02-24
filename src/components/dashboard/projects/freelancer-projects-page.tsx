import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreelancerActiveProjectsTab } from "@/components/dashboard/projects/freelancer-active-projects-tab";
import { FreelancerCompletedProjectsTab } from "@/components/dashboard/projects/freelancer-completed-projects-tab";
import { getProjectsByFreelancer } from "@/app/actions";

// ✅ Серверный компонент
export async function FreelancerProjectsPage() {
  const { active, completed } = await getProjectsByFreelancer();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Мои проекты</h1>
        <p className="text-muted-foreground">
          Управляйте вашими текущими и завершенными проектами.
        </p>
      </div>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2 sm:max-w-sm">
          <TabsTrigger value="active">Активные ({active.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Завершенные ({completed.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <FreelancerActiveProjectsTab projects={active} />
        </TabsContent>
        <TabsContent value="completed">
          <FreelancerCompletedProjectsTab projects={completed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
