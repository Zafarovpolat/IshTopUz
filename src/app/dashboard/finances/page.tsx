
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { FreelancerFinancesPage } from '@/components/dashboard/finances/freelancer-finances-page';
import { ClientFinancesPage } from '@/components/dashboard/finances/client-finances-page';

export default async function FinancesPage() {
  const userData = await getUserData();

  if (!userData) {
    redirect('/auth');
  }

  if (userData.userType === 'freelancer') {
    return <FreelancerFinancesPage />;
  }

  if (userData.userType === 'client') {
    return <ClientFinancesPage />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Не удалось определить вашу роль</h1>
      <p className="text-muted-foreground">Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}
