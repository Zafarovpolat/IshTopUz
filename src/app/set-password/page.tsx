import { getUserData, getUserId } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { SetPasswordForm } from '@/components/set-password-form';

export default async function SetPasswordPage() {
    const userId = await getUserId();
    const userData = await getUserData();

    console.log('🔍 [SetPasswordPage] userId:', userId);
    console.log('🔍 [SetPasswordPage] userData:', userData);

    // ✅ Если не авторизован - редирект на вход
    if (!userId || !userData) {
        console.log('❌ [SetPasswordPage] No userId or userData, redirecting to /auth');
        redirect('/auth');
    }

    // ✅ Если профиль не заполнен - вернуть на onboarding
    if (!userData.profileComplete) {
        console.log('❌ [SetPasswordPage] Profile not complete, redirecting to /onboarding');
        redirect('/onboarding');
    }

    // ✅ Если пароль уже установлен - редирект на dashboard
    // ВАЖНО: проверяем именно === true, чтобы undefined не проходил
    if (userData.passwordSet === true) {
        console.log('✅ [SetPasswordPage] Password already set, redirecting to /dashboard');
        redirect('/dashboard');
    }

    // ✅ Если passwordSet === false или undefined - показываем форму
    console.log('📝 [SetPasswordPage] Showing password form');

    const email = userData.email || '';
    const fullName = `${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}`.trim();

    console.log('📧 [SetPasswordPage] Email:', email);
    console.log('👤 [SetPasswordPage] Full Name:', fullName);

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
            <SetPasswordForm email={email} fullName={fullName} />
        </div>
    );
}