"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema } from "@/lib/schema";
import type { LeadState, SurveyState } from "@/lib/schema";
import { redirect } from "next/navigation";

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
  
  // Here you would typically save to a database like Firebase Firestore
  try {
    console.log("New Lead Submitted:", {
      ...validatedFields.data,
      timestamp: new Date(),
    });

    // On success, redirect to the survey page with the role
  } catch (e) {
    console.error("Failed to submit lead:", e);
    return {
      success: false,
      message: "Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.",
    };
  }

  redirect(`/survey?role=${validatedFields.data.role}`);
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
    console.log("New Survey Submitted:", {
      role: role,
      ...validatedFields.data,
      timestamp: new Date(),
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