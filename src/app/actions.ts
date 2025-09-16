
"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema } from "@/lib/schema";
import type { LeadState, SurveyState } from "@/lib/schema";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

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
