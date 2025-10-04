
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { FreelancerProjectsPage } from '@/components/dashboard/projects/freelancer-projects-page';
import { ClientProjectsPage } from '@/components/dashboard/projects/client-projects-page';

export default async function ProjectsPage() {
  const userData = await getUserData();

  if (!userData) {
    redirect('/auth');
  }

  if (userData.userType === 'freelancer') {
    return <FreelancerProjectsPage />;
  }

  if (userData.userType === 'client') {
    return <ClientProjectsPage />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Не удалось определить вашу роль</h1>
      <p className="text-muted-foreground">Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}
