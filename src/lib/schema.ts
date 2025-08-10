import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  role: z.enum(['Freelancer', 'Client'], { message: 'Выберите роль: Фрилансер или Заказчик' }),
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

export type SurveyState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
  success: boolean;
};