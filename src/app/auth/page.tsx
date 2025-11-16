import { Suspense } from 'react';
import { AuthForm } from '@/components/auth-form';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
