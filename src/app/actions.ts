"use server";

import { z } from "zod";
import { leadSchema } from "@/lib/schema";
import type { LeadState } from "@/lib/schema";

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

    return { success: true, message: "Спасибо за присоединение к бета-программе!" };
  } catch (e) {
    console.error("Failed to submit lead:", e);
    return {
      success: false,
      message: "Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.",
    };
  }
}
