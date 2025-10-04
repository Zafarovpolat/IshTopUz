
import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  role: z.enum(['Freelancer', 'Client'], { message: 'Выберите роль: Фрилансер или Заказчик' }),
});

export const onboardingSchema = z.object({
  firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа.'),
  lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа.'),
  userType: z.enum(['freelancer', 'client'], {
    required_error: 'Пожалуйста, выберите вашу роль.',
  }),
});

const languages = z.string().optional();

export const profileFreelancerSchema = z.object({
  // profile
  firstName: z.string().min(2, "Имя обязательно."),
  lastName: z.string().min(2, "Фамилия обязательна."),
  location: z.string().optional(),
  // freelancerProfile
  specialization: z.string().optional(),
  hourlyRate: z.number().min(0, "Ставка должна быть положительным числом.").optional(),
  skills: z.string().optional(), // Assuming skills are a comma-separated string for now
  experience: z.enum(['less-than-1', '1-3-years', 'more-than-3']).optional(),
  availability: z.enum(['full-time', 'part-time', 'project-based']).optional(),
  about: z.string().optional(),
  languages,
});


export const profileClientSchema = z.object({
    // profile
    firstName: z.string().min(2, "Имя обязательно."),
    lastName: z.string().min(2, "Фамилия обязательна."),
    // clientProfile
    companyName: z.string().optional(),
    companySize: z.enum(['1', '2-10', '11-50', '51+']).optional(),
    industry: z.string().optional(),
    website: z.string().url("Неверный формат URL-адреса.").optional().or(z.literal('')),
});


export const surveyFreelancerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  leadId: z.string().optional(), // ID записи из leads
  profession: z.string().optional(),
  experience: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  paymentIssues: z.string().optional(),
  localPaymentSystems: z.string().optional(),
  commissionAgreement: z.string().optional(),
  useTelegram: z.string().optional(),
  desiredFeatures: z.string().optional(),
  betaTest: z.string().optional(),
});

export const surveyClientSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  leadId: z.string().optional(), // ID записи из leads
  services: z.array(z.string()).optional(),
  businessType: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  qualityIssues: z.string().optional(),
  localPaymentSystems: z.string().optional(),
  commissionAttractiveness: z.string().optional(),
  useSocials: z.string().optional(),
  verificationValue: z.string().optional(),
  hiringDifficulties: z.string().optional(),
  betaTest: z.string().optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(3, "Заголовок должен содержать минимум 3 символа."),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов."),
  imageUrl: z.string().url("Требуется действительный URL изображения."),
  tags: z.string().optional(),
});

export type PortfolioItem = z.infer<typeof portfolioItemSchema> & {
  id: string;
  createdAt: string;
};


export type LeadState = {
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
  };
  message?: string | null;
  success: boolean;
  redirectUrl?: string;
};

export type OnboardingState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    userType?: string[];
  };
  message?: string | null;
  success: boolean;
};

export type SurveyState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
  success: boolean;
};

export type ProfileState = {
    errors?: { [key: string]: string[] }
    message?: string | null;
    success: boolean;
};

export type PortfolioState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
  success: boolean;
};
