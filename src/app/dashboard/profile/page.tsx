
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { getUserId } from '@/lib/get-user-data';

export default async function ProfilePage() {
  const userData = await getUserData();
  const userId = await getUserId();

  if (!userData || !userId) {
    redirect('/auth');
  }

  // Добавляем uid к объекту пользователя, чтобы он был доступен в клиентском компоненте
  const userWithId = { ...userData, uid: userId };

  return <ProfileForm user={userWithId} />;
}

    