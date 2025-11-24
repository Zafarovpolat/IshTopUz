import { getUserData } from '@/lib/get-user-data';
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { redirect } from 'next/navigation';
import { getDashboardStats, getRecentProjects, getRecommendedProjects } from '@/app/actions';

export default async function DashboardPage() {
  const userData = await getUserData();

  if (!userData) {
    return redirect('/auth');
  }

  const { userType, uid } = userData;

  // ✅ Получаем данные для Dashboard
  const stats = await getDashboardStats(uid, userType);
  const recentProjects = await getRecentProjects(uid, userType, 5);

  if (userType === 'freelancer') {
    // ✅ Получаем рекомендованные проекты только для фрилансеров
    const recommendedProjects = await getRecommendedProjects(uid, 3);

    return (
      <FreelancerDashboard
        userData={userData}
        stats={stats}
        recentProjects={recentProjects}
        recommendedProjects={recommendedProjects}
      />
    );
  }

  if (userType === 'client') {
    return (
      <ClientDashboard
        userData={userData}
        stats={stats}
        recentProjects={recentProjects}
      />
    );
  }

  // Fallback for users with no type or 'both'
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
      <p>Ваша роль не определена. Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}