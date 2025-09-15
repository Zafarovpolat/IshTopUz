
"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema, onboardingSchema } from "@/lib/schema";
import type { LeadState, SurveyState, OnboardingState } from "@/lib/schema";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

async function getCurrentUserId(): Promise<string | null> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    console.log("Session cookie not found.");
    return null;
  }
  
  const adminApp = getAdminApp();
  if (!adminApp) {
    console.log("Admin SDK not initialized, cannot verify session cookie.");
    return null;
  }

  try {
    const decodedToken = await getAuth(adminApp).verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    if ((error as any).code === 'auth/session-cookie-expired' || (error as any).code === 'auth/session-cookie-revoked') {
      // Это ожидаемые ошибки, не нужно логировать их как сбой
    } else {
      console.error("Error verifying session cookie:", error);
    }
    return null;
  }
}

export async function submitOnboarding(data: z.infer<typeof onboardingSchema>): Promise<OnboardingState> {
  const validatedFields = onboardingSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }
  
  const userId = await getCurrentUserId();
  if (!userId) {
    return {
      success: false,
      message: 'Ошибка аутентификации. Пожалуйста, войдите снова.',
    };
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'profile.firstName': validatedFields.data.firstName,
      'profile.lastName': validatedFields.data.lastName,
      userType: validatedFields.data.userType,
      profileComplete: true,
    });
    return {
      success: true,
      message: 'Профиль успешно обновлен!',
    };
  } catch (e) {
    console.error('Failed to submit onboarding data:', e);
    return {
      success: false,
      message: 'Что-то пошло не так. Попробуйте позже.',
    };
  }
}


export async function submitLead(
  data: z.infer<typeof leadSchema>
): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.',
      success: false,
    };
  }

  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...validatedFields.data,
    });
    return {
      success: true,
      message: 'Форма успешно отправлена! Перенаправляем...',
      redirectUrl: `/survey?role=${validatedFields.data.role}&leadId=${docRef.id}&name=${encodeURIComponent(validatedFields.data.name)}&email=${encodeURIComponent(validatedFields.data.email)}`,
    };
  } catch (e) {
    console.error('Failed to submit lead:', e);
    return {
      success: false,
      message: 'Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.',
    };
  }
}

export async function submitSurvey(
  data: z.infer<typeof surveyFreelancerSchema> | z.infer<typeof surveyClientSchema>,
  role: 'Freelancer' | 'Client'
): Promise<SurveyState> {
  if (!['Freelancer', 'Client'].includes(role)) {
    return { success: false, message: 'Неверная роль' };
  }

  const schema = role === 'Freelancer' ? surveyFreelancerSchema : surveyClientSchema;
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.',
      success: false,
    };
  }

  try {
    await addDoc(collection(db, 'surveys'), {
      role,
      ...validatedFields.data,
    });
    return { success: true, message: 'Спасибо за ваш отзыв!' };
  } catch (error: any) {
    console.error('Firestore error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      message: `Ошибка при отправке данных: ${error.message || 'Неизвестная ошибка'}`,
    };
  }
}
