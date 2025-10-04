
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { FreelancerOffersPage } from '@/components/dashboard/offers/freelancer-offers-page';
import { ClientOffersPage } from '@/components/dashboard/offers/client-offers-page';

export default async function OffersPage() {
  const userData = await getUserData();

  if (!userData) {
    redirect('/auth');
  }

  if (userData.userType === 'freelancer') {
    return <FreelancerOffersPage />;
  }
  
  if (userData.userType === 'client') {
    return <ClientOffersPage />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Не удалось определить вашу роль</h1>
      <p className="text-muted-foreground">Пожалуйста, обратитесь в поддержку.</p>
    </div>
  );
}
