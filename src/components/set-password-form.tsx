"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { setPasswordSchema } from "@/lib/schema";
import { setUserPassword } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "./layout/logo";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

export function SetPasswordForm({
  email,
  fullName,
}: {
  email: string;
  fullName?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SetPasswordFormValues) => {
    startTransition(async () => {
      try {
        console.log("🔐 Submitting password...");

        const result = await setUserPassword(data.password);

        console.log("📥 Set password result:", result);

        if (result.success) {
          setIsSuccess(true);

          toast({
            title: "Пароль установлен!",
            description: "Выполняется вход...",
          });

          // ✅ Автоматически входим с новым паролем
          try {
            console.log("🔑 Auto-signing in with new password...");

            // Сначала выходим из текущей сессии
            await auth.signOut();

            // Входим с email и новым паролем
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              data.password,
            );
            console.log("✅ Signed in successfully:", userCredential.user.uid);

            // Создаём новую session cookie
            const idToken = await userCredential.user.getIdToken();
            const response = await fetch("/api/auth/session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
              throw new Error("Failed to create session");
            }

            console.log("✅ Session cookie created");

            // Небольшая задержка для сохранения cookie
            await new Promise((resolve) => setTimeout(resolve, 300));

            toast({
              title: "Добро пожаловать!",
              description: "Вы успешно вошли в систему.",
            });

            // Переходим в dashboard
            console.log("🚀 Redirecting to /dashboard");
            router.push("/dashboard");
            router.refresh();
          } catch (signInError: any) {
            console.error("❌ Auto sign-in failed:", signInError);

            // Если автовход не удался — перенаправляем на страницу входа
            toast({
              title: "Пароль установлен!",
              description: "Войдите с новым паролем.",
            });

            router.push("/auth?message=password-set");
          }
        } else {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: result.message || "Не удалось установить пароль.",
          });
        }
      } catch (error) {
        console.error("❌ Unexpected error:", error);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Произошла непредвиденная ошибка.",
        });
      }
    });
  };

  // ✅ Показываем успешное состояние
  if (isSuccess) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Пароль установлен!</h2>
            <p className="text-muted-foreground">
              Выполняется вход в систему...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
          <Logo />
        </div>
        <CardTitle className="text-3xl font-bold">
          {fullName ? `Привет, ${fullName}! 👋` : "Создайте пароль"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Установите пароль для входа через email: <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Пароль
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Минимум 6 символов"
                        {...field}
                        disabled={isPending}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Минимум 6 символов, включая букву и цифру
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Подтвердите пароль
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Повторите пароль"
                        {...field}
                        disabled={isPending}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isPending}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Установить пароль"
              )}
            </Button>

            {/* ✅ Убрали кнопку "Пропустить" */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
