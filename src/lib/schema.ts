import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["Freelancer", "Client"], { required_error: "Please select a role." }),
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
