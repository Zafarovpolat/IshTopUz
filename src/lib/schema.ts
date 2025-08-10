import { z } from "zod";

// This can be expanded with language-specific messages
export const leadSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать не менее 2 символов." }),
  email: z.string().email({ message: "Пожалуйста, введите действительный адрес электронной почты." }),
  role: z.enum(["Freelancer", "Client"], { required_error: "Пожалуйста, выберите роль." }),
});

export type LeadState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
  };
  message?: string | null;
  success: boolean;
};
