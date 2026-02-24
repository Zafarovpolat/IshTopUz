import { getUserData } from "@/lib/get-user-data";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const userData = await getUserData();

  // Если нет сессии — на auth
  if (!userData) {
    redirect("/auth");
  }

  // ✅ Если профиль уже заполнен — на dashboard
  if (userData.profileComplete === true) {
    redirect("/dashboard");
  }

  // Показываем форму onboarding
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <OnboardingForm />
    </div>
  );
}
