import { Suspense } from 'react';
import AuthPageContent from './AuthPageContent';

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Загрузка...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}