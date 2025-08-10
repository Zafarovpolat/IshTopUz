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
  redirectUrl?: string;
} | void;


export const surveyFreelancerSchema = z.object({
    profession: z.string({required_error: "Пожалуйста, выберите профессию."}),
    experience: z.string({required_error: "Пожалуйста, выберите ваш опыт."}),
    platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "Необходимо выбрать хотя бы один вариант.",
    }),
    paymentIssues: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    localPaymentSystems: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    commissionAgreement: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    useTelegram: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    desiredFeatures: z.string().optional(),
    betaTest: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
});

export const surveyClientSchema = z.object({
    services: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "Необходимо выбрать хотя бы один вариант.",
    }),
    businessType: z.string({required_error: "Пожалуйста, выберите тип вашего бизнеса."}),
    platforms: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Необходимо выбрать хотя бы один вариант.",
    }),
    qualityIssues: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    localPaymentSystems: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    commissionAttractiveness: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    useSocials: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    verificationValue: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
    hiringDifficulties: z.string().optional(),
    betaTest: z.string({required_error: "Пожалуйста, ответьте на этот вопрос."}),
});

export type SurveyState = {
    errors?: any;
    message?: string | null;
    success: boolean;
};
