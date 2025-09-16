
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';

export default async function ProfilePage() {
  const userData = await getUserData();

  if (!userData) {
    return redirect('/auth');
  }

  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-4xl gap-2">
        <h1 className="text-3xl font-semibold">Настройки профиля</h1>
      </div>

      <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
        <ProfileForm user={userData} />
      </div>
    </main>
  );
}
