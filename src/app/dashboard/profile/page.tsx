
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { getUserId } from '@/lib/get-user-data';


export default async function ProfilePage() {
  const userData = await getUserData();
  const userId = await getUserId();


  if (!userData || !userId) {
    return redirect('/auth');
  }

  // Добавляем uid в объект пользователя
  const userWithId = { ...userData, uid: userId };

  return (
    <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-4xl gap-2">
        <h1 className="text-3xl font-semibold">Настройки профиля</h1>
      </div>

      <div className="mx-auto grid w-full max-w-4xl items-start gap-6">
        <ProfileForm user={userWithId} />
      </div>
    </main>
  );
}

    