
import { getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';

export default async function ProfilePage() {
  const userData = await getUserData();

  if (!userData) {
    redirect('/auth');
  }

  return <ProfileForm user={userData} />;
}
