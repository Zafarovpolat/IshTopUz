import { getUserData } from "@/lib/get-user-data";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { FreelancerDashboard } from "@/components/dashboard/freelancer-dashboard";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getRecentProjects,
  getRecommendedProjects,
} from "@/app/actions";

export default async function DashboardPage() {
  const userData = await getUserData();

  if (!userData) {
    return redirect("/auth");
  }

  const { userType } = userData;

  // ✅ Убрали uid — теперь получается на сервере в actions
  const stats = await getDashboardStats(userType);
  const recentProjects = await getRecentProjects(userType, 5);

  if (userType === "freelancer") {
    const recommendedProjects = await getRecommendedProjects(3);

    return (
      <FreelancerDashboard
        userData={userData}
        stats={stats}
        recentProjects={recentProjects}
        recommendedProjects={recommendedProjects}
      />
    );
  }

  if (userType === "client") {
    return (
      <ClientDashboard
        userData={userData}
        stats={stats}
        recentProjects={recentProjects}
      />
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
      <p>Ваша роль не определена. Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}
