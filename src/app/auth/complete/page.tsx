
import { Suspense } from 'react';
import { AuthCompleteClient } from './AuthCompleteClient';
import { Loader2 } from 'lucide-react';

function AuthCompleteFallback() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <Loader2 className="mr-2 h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Завершение авторизации...</p>
        </div>
    );
}

export default function AuthCompletePage() {
  return (
    <Suspense fallback={<AuthCompleteFallback />}>
      <AuthCompleteClient />
    </Suspense>
  );
}
