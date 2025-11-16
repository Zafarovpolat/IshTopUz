import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/onboarding-form';

export default async function OnboardingPage() {
  const userData = await getUserData();

  // ✅ Если cookie невалидна или уже есть профиль
  if (!userData) {
    redirect('/auth');
  }

  if (userData.profileComplete) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <OnboardingForm />
    </div>
  );
}