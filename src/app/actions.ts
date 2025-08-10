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
      message: "Validation failed. Please correct the errors and try again.",
      success: false,
    };
  }
  
  // Here you would typically save to a database like Firebase Firestore
  try {
    console.log("New Lead Submitted:", {
      ...validatedFields.data,
      timestamp: new Date(),
    });

    return { success: true, message: "Thank you for joining the beta program!" };
  } catch (e) {
    console.error("Failed to submit lead:", e);
    return {
      success: false,
      message: "Something went wrong on our end. Please try again later.",
    };
  }
}
