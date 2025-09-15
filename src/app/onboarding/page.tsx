
import { OnboardingForm } from '@/components/onboarding-form';
import { Suspense } from 'react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-secondary/50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-foreground">Загрузка...</div>}>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}
