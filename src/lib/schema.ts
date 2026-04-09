
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
  // ✅ ИЗМЕНЕНО: email обязателен
  email: z.string().email('Неверный формат email').min(1, 'Email обязателен'),
});

export const setPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .regex(/[A-Za-z]/, 'Пароль должен содержать хотя бы одну букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type SetPasswordState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string;
  success: boolean;
  requiresReauth?: boolean; // ✅ Флаг для реавторизации
};

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
  imageUrl: z.string().url("Пожалуйста, загрузите изображение проекта."),
  projectUrl: z.string().url("Неверный формат URL-адреса.").optional().or(z.literal('')),
  technologies: z.union([z.string(), z.array(z.string())]).optional(),
});

// Used for retrieving data, not for forms
export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
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
    email?: string[]; // ✅ ДОБАВЬ
  };
  message?: string | null;
  success: boolean;
  redirectUrl?: string; // ✅ ДОБАВЬ
  newToken?: string; // ✅ Новый токен для переавторизации
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

// ========== Settings ==========

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Введите текущий пароль.'),
  newPassword: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .regex(/[A-Za-z]/, 'Пароль должен содержать хотя бы одну букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export const notificationSettingsSchema = z.object({
  emailNews: z.boolean().default(true),
  emailMessages: z.boolean().default(true),
  telegramInvites: z.boolean().default(false),
  telegramMessages: z.boolean().default(false),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['visible', 'platform-only', 'hidden']),
});

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;

export type SettingsState = {
  errors?: { [key: string]: string[] };
  message?: string | null;
  success: boolean;
};

// ========== Notifications ==========

export type AppNotification = {
  id: string;
  type: 'proposal_received' | 'proposal_accepted' | 'proposal_rejected' | 'project_completed' | 'new_message' | 'invitation' | 'review_received' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

// ========== Reviews ==========

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Комментарий должен быть не менее 10 символов.').max(1000),
  projectId: z.string().min(1),
  targetUserId: z.string().min(1),
});

export type Review = {
  id: string;
  projectId: string;
  authorId: string;
  targetUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: {
    name: string;
    avatar: string;
  };
};

export type ReviewState = {
  errors?: { [key: string]: string[] };
  message?: string | null;
  success: boolean;
};

// ========== Chat ==========

export type Conversation = {
  id: string;
  participants: string[];
  participantsInfo: {
    [uid: string]: {
      name: string;
      avatar: string;
    };
  };
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderId?: string;
  unreadCount?: { [uid: string]: number };
  projectId?: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
};

export const sendMessageSchema = z.object({
  text: z.string().min(1).max(2000),
});


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
  freelancerName?: string;
  freelancerAvatar?: string;
  deadline?: string;
  completedAt?: string;
  files?: { name: string; url: string; size: number }[];
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
