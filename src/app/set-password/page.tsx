import { getUserData, getUserId } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { SetPasswordForm } from '@/components/set-password-form';

export default async function SetPasswordPage() {
    const userId = await getUserId();
    const userData = await getUserData();

    // Если не авторизован
    if (!userId) {
        redirect('/auth');
    }

    // Если профиль не заполнен
    if (!userData?.profileComplete) {
        redirect('/onboarding');
    }

    // Если уже есть email/password provider
    // (это означает что пользователь уже установил пароль или зарегался через email)
    // Можно пропустить эту проверку если хочешь разрешить смену пароля

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <SetPasswordForm email={userData.email} />
        </div>
    );
}