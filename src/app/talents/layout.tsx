
import { Suspense } from 'react';
import type { User } from 'firebase/auth';
import { getUserId, getUserData } from '@/lib/get-user-data';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { Loader2 } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default async function TalentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getUserId();

  if (userId) {
    const userData = await getUserData();

    if (userData) {
      return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <DashboardSidebar userType={userData.userType as 'freelancer' | 'client'} />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <DashboardHeader user={userData as User} />
            <main className="flex-1 items-start p-4 sm:px-6 sm:py-0">
              <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                {children}
              </Suspense>
            </main>
          </div>
          <Toaster />
        </div>
      );
    }
  }

  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
