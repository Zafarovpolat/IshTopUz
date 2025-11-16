import { getUserData } from '@/lib/get-user-data';
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const userData = await getUserData();

  if (!userData) {
    return redirect('/auth');
  }

  const { userType } = userData;

  if (userType === 'freelancer') {
    return <FreelancerDashboard />;
  }

  if (userType === 'client') {
    return <ClientDashboard userData={userData} />;
  }

  // Fallback for users with no type or 'both'
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
      <p>Ваша роль не определена. Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}
