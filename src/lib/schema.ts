
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

const languages = z.union([z.string(), z.array(z.string())]).optional();

export const profileFreelancerSchema = z.object({
  // profile
  firstName: z.string().min(2, "Имя обязательно."),
  lastName: z.string().min(2, "Фамилия обязательна."),
  city: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  languages,
  
  // freelancerProfile
  title: z.string().min(5, "Заголовок должен содержать хотя бы 5 символов.").optional(),
  hourlyRate: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Ставка должна быть положительным числом.").optional()
  ),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  experience: z.enum(['beginner', 'intermediate', 'expert']).optional(),
  isAvailable: z.boolean().optional(),
  description: z.string().optional(),
});


export const profileClientSchema = z.object({
    // profile
    firstName: z.string().min(2, "Имя обязательно."),
    lastName: z.string().min(2, "Фамилия обязательна."),
    city: z.string().optional(),
    country: z.string().optional(),
    // clientProfile
    companyName: z.string().optional(),
    companySize: z.enum(['1', '2-10', '11-50', '51+']).optional(),
    industry: z.string().optional(),
    website: z.string().url("Неверный формат URL-адреса.").optional().or(z.literal('')),
    description: z.string().optional(),
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
  mainImageUrl: z.string().url("Пожалуйста, загрузите основное изображение проекта."),
  galleryImageUrls: z.array(z.string().url()).optional(),
  projectUrl: z.string().url("Неверный формат URL-адреса.").optional().or(z.literal('')),
  technologies: z.union([z.string(), z.array(z.string())]).optional(),
  category: z.string().min(1, "Пожалуйста, выберите категорию."),
});

// Used for retrieving data, not for forms
export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  mainImageUrl: string;
  galleryImageUrls?: string[];
  projectUrl?: string;
  technologies: string[];
  category: string;
  createdAt: string;
};

export const projectSchema = z.object({
  title: z.string().min(10, 'Заголовок должен быть не менее 10 символов.'),
  description: z.string().min(50, 'Описание должно быть не менее 50 символов.'),
  skills: z.string().min(1, 'Укажите хотя бы один навык.'),
  budgetType: z.enum(['fixed', 'hourly']),
  budgetAmount: z.preprocess(
    (a) => parseFloat(String(a)),
    z.number().positive('Сумма должна быть положительной.')
  ),
  deadline: z.date().optional(),
});

export const proposalSchema = z.object({
  bidAmount: z.preprocess(
    (a) => parseFloat(String(a)),
    z.number().positive('Ставка должна быть положительной.')
  ),
  bidDuration: z.preprocess(
    (a) => parseInt(String(a), 10),
    z.number().int().positive('Срок должен быть положительным числом.')
  ),
  coverLetter: z.string().min(20, 'Сопроводительное письмо должно содержать не менее 20 символов.'),
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
    errors?: { [key:string]: string[] }
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

export type ProjectState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
  success: boolean;
};

export type ProposalState = {
  errors?: z.ZodError<z.infer<typeof proposalSchema>>['formErrors']['fieldErrors'];
  message?: string | null;
  success: boolean;
};


export interface Project {
    id: string;
    title: string;
    description: string;
    budgetType: 'fixed' | 'hourly';
    budgetAmount: number;
    skills: string[];
    createdAt: string;
    clientId: string;
    status: 'open' | 'in_progress' | 'completed' | 'closed';
    proposalsCount?: number;
    freelancerId?: string;
    deadline?: string;
    completedAt?: string;
}

export type Proposal = {
  id: string;
  freelancerId: string;
  bidAmount: number;
  bidDuration: number;
  coverLetter: string;
  createdAt: string;
  freelancer: {
    name: string;
    avatar: string;
    rating: number;
    title: string;
  }
};
