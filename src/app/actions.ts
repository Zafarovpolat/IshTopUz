"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema } from "@/lib/schema";
import type { LeadState, SurveyState } from "@/lib/schema";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function submitLead(
  data: z.infer<typeof leadSchema>
): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.",
      success: false,
    };
  }
  
  try {
    await addDoc(collection(db, "leads"), {
      ...validatedFields.data,
      submittedAt: Timestamp.now(),
    });
  } catch (e) {
    console.error("Failed to submit lead:", e);
    return {
      success: false,
      message: "Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.",
    };
  }
  
  return {
    success: true,
    message: "Форма успешно отправлена! Перенаправляем...",
    redirectUrl: `/survey?role=${validatedFields.data.role}`
  };
}

export async function submitSurvey(
  data: z.infer<typeof surveyFreelancerSchema> | z.infer<typeof surveyClientSchema>,
  role: "Freelancer" | "Client"
): Promise<SurveyState> {
  
  const schema = role === 'Freelancer' ? surveyFreelancerSchema : surveyClientSchema;
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.",
      success: false,
    };
  }

  try {
    await addDoc(collection(db, "surveys"), {
      role: role,
      ...validatedFields.data,
      submittedAt: Timestamp.now(),
    });

    return { success: true, message: "Спасибо за ваш отзыв!" };
  } catch (e) {
    console.error("Failed to submit survey:", e);
    return {
      success: false,
      message: "Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.",
    };
  }
}
