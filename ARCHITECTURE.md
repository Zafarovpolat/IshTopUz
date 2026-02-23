# 🏗️ ARCHITECTURE.md — Архитектура IshTop.Uz

> Документ описывает техническую архитектуру проекта, потоки данных, соглашения о коде и решения по дизайну системы.

_Обновлено: 2026-02-23_

---

## 1. Обзор архитектуры

```
┌─────────────────────────────────────────────────────────┐
│                     КЛИЕНТ (Browser)                      │
│  Next.js App Router — React Server Components + Client   │
│  Tailwind CSS | Radix UI | React Hook Form | Recharts    │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / Server Actions
┌────────────────────────▼────────────────────────────────┐
│                  СЕРВЕР (Next.js)                         │
│  App Router / RSC / Server Actions (actions.ts)          │
│  Firebase Admin SDK — Firestore | Auth | Storage         │
│  Middleware — Session Cookie защита маршрутов            │
└─────────────┬──────────────────────────┬────────────────┘
              │                          │
┌─────────────▼──────┐      ┌────────────▼────────────────┐
│  Firebase Services │      │  Google Genkit (AI)          │
│  • Firestore       │      │  • Gemini 2.0 Flash          │
│  • Authentication  │      │  • AI flows (в разработке)   │
│  • Storage         │      └─────────────────────────────-┘
│  • App Hosting     │
└────────────────────┘
```

---

## 2. Слои приложения

### 2.1 Маршрутизация (App Router)

| Маршрут            | Тип                         | Описание                       |
| ------------------ | --------------------------- | ------------------------------ |
| `/`                | Public                      | Landing Page                   |
| `/auth`            | Public (redirect if authed) | Вход / Регистрация             |
| `/onboarding`      | Protected                   | Выбор роли (freelancer/client) |
| `/set-password`    | Protected                   | Установка пароля для OAuth     |
| `/dashboard/*`     | Protected                   | Личный кабинет                 |
| `/jobs`            | Public                      | Биржа проектов                 |
| `/talents`         | Public                      | Каталог фрилансеров            |
| `/marketplace/*`   | Public                      | Детальные страницы             |
| `/survey`          | Public                      | Опросник                       |
| `/freelancers/:id` | Public                      | Публичный профиль фрилансера   |

### 2.2 Server Actions (`src/app/actions.ts`)

Весь серверный код сосредоточен в одном файле (1554 строки, 30+ функций).

**Группы функций:**

```
Authentication & Onboarding:
  createUserOnboarding()    — создание/обновление профиля при онбординге
  setUserPassword()         — установка пароля через Firebase Admin

Profile:
  updateProfile()           — обновление профиля (freelancer/client + avatar)

Portfolio:
  addPortfolioItem()        — добавление работы
  deletePortfolioItem()     — удаление с security check

Projects:
  createProject()           — создание проекта
  updateProject()           — редактирование проекта
  getProjectsByClientId()   — проекты клиента

Proposals:
  submitProposal()          — подача заявки + notification
  updateProposal()          — редактирование заявки
  deleteProposal()          — удаление заявки
  getProposalsByFreelancer()— заявки фрилансера (collection group query)
  getProposalsByClient()    — заявки на проекты клиента

Dashboard:
  getDashboardStats()       — статистика (freelancer/client)
  getRecentProjects()       — последние проекты
  getRecommendedProjects()  — рекомендации по навыкам

Finances:
  completeProject()         — завершение + начисление с комиссией 5%
  getWalletTransactions()   — история транзакций
  addPaymentMethod()        — добавление метода оплаты
  deletePaymentMethod()     — удаление
  setDefaultPaymentMethod() — установка дефолтного

Notifications:
  getNotifications()        — получить уведомления
  markAsRead()              — пометить прочитанным
  markAllAsRead()           — пометить все прочитанными

Settings:
  updatePassword()          — смена пароля
  updateNotificationSettings() — настройки уведомлений
  updatePrivacySettings()   — настройки приватности

Survey & Leads:
  submitLead()              — захват лида с landing
  submitSurvey()            — отправка опросника
```

### 2.3 Защита и безопасность

**Middleware (`src/middleware.ts`):**

- Проверяет `session` cookie на каждый запрос
- Редиректит на `/auth` если cookie нет и маршрут защищён
- Редиректит на `/dashboard` если пользователь уже авторизован и идёт на `/auth`

**Server Actions Security Pattern:**

```typescript
// Каждое действие проверяет права доступа
const currentUserId = await getUserId(); // читает session cookie
if (!currentUserId || currentUserId !== targetUserId) {
  return { success: false, message: "Permission denied" };
}
```

**Зоны контроля:**

- `getUserId()` — декодирует session cookie через Firebase Admin
- `deletePortfolioItem()` — проверяет владельца
- `updateProfile()` — проверяет владельца
- `getProposalsByFreelancer()` — проверяет что запросчик = фрилансер
- `getProposalsByClient()` — проверяет что запросчик = клиент

---

## 3. Модель данных (Firestore)

### 3.1 Коллекция `users`

```typescript
interface User {
  // Основные данные
  email: string;
  phone: string;
  userType: "freelancer" | "client";
  isVerified: boolean;
  passwordSet: boolean;
  profileComplete: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  updatedAt: Timestamp;

  // Профиль
  profile: {
    firstName: string;
    lastName: string;
    avatar: string; // URL в Firebase Storage
    city: string;
    country: string;
    dateOfBirth: string;
    gender: string;
    languages: string[];
    timezone: string;
    visibility?: string; // 'public' | 'private'
  };

  // Только для фрилансеров
  freelancerProfile?: {
    title: string;
    description: string;
    hourlyRate: number; // В USD
    skills: string[];
    categories: string[];
    experience: "beginner" | "intermediate" | "expert";
    completedProjects: number;
    rating: number; // 0-5
    reviewsCount: number;
    isAvailable: boolean;
    lastActiveAt: Timestamp;
  };

  // Только для клиентов
  clientProfile?: {
    companyName: string;
    companySize: "1" | "2-10" | "11-50" | "51+";
    industry: string;
    website: string;
    description: string;
    projectsPosted: number;
    moneySpent: number; // В UZS
    rating: number;
    reviewsCount: number;
  };

  // Кошелёк
  wallet: {
    balance: number; // В UZS
    currency: "UZS";
    paymentMethods: PaymentMethod[];
    transactions: Transaction[];
  };

  // Настройки
  notificationSettings?: {
    email: boolean;
    push: boolean;
    newProposals: boolean;
    projectUpdates: boolean;
  };
}
```

### 3.2 Субколлекция `users/{uid}/portfolio`

```typescript
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies: string[];
  createdAt: Timestamp;
}
```

### 3.3 Коллекция `projects`

```typescript
interface Project {
  title: string;
  description: string;
  skills: string[];
  budgetType: "fixed" | "hourly";
  budgetAmount: number;
  deadline?: Timestamp;
  clientId: string;
  freelancerId?: string; // После найма
  status: "open" | "in_progress" | "completed" | "closed";
  proposalsCount: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

### 3.4 Субколлекция `projects/{id}/proposals`

```typescript
interface Proposal {
  freelancerId: string;
  bidAmount: number;
  bidDuration: number; // В днях
  coverLetter: string;
  status: "submitted" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### 3.5 Коллекция `notifications`

```typescript
interface Notification {
  recipientId: string;
  senderId: string;
  senderName: string;
  type: "new_proposal" | "proposal_accepted" | "project_completed";
  message: string;
  entityId: string; // projectId
  entityType: "project";
  isRead: boolean;
  createdAt: Timestamp;
}
```

---

## 4. Аутентификация (детально)

### Flow 1: Email/Password

```
1. AuthForm → Firebase signInWithEmailAndPassword()
2. IdToken → POST /api/auth/session
3. Server создаёт session cookie (14 дней)
4. Redirect /dashboard
```

### Flow 2: Google OAuth

```
1. AuthForm → Firebase signInWithPopup(GoogleProvider)
2. IdToken → POST /api/auth/session
3. Server создаёт session cookie
4. Если нет Firestore doc → Redirect /onboarding
5. Onboarding → createUserOnboarding() Server Action
6. Если passwordSet=false → Redirect /set-password
7. setUserPassword() → Firebase Admin updateUser()
8. RequiresReauth=true → Client signInWithEmailAndPassword()
9. Создаём новый session cookie → Redirect /dashboard
```

### Flow 3: Telegram

```
1. Telegram Bot callback → POST /api/auth/telegram
2. Server верифицирует hash (HMAC-SHA256)
3. createCustomToken() → Firebase signInWithCustomToken()
4. IdToken → POST /api/auth/session
5. Аналогично Google Flow 4-9
```

---

## 5. Компонентная архитектура

### 5.1 Иерархия компонентов Dashboard

```
DashboardLayout (layout.tsx)
  ├── DashboardHeader (header.tsx)
  │   ├── NotificationBell
  │   └── UserMenu (avatar, logout)
  ├── DashboardSidebar (sidebar.tsx)
  │   └── Nav links по userType
  └── <children> (page content)
      ├── FreelancerDashboard / ClientDashboard
      ├── FreelancerProjectsPage / ClientProjectsPage
      ├── FreelancerOffersPage / ClientOffersPage
      ├── PortfolioClientPage
      ├── FreelancerFinancesPage / ClientFinancesPage
      └── Settings (Security, Notifications, Privacy tabs)
```

### 5.2 Паттерн форм

Все формы используют единый паттерн:

```typescript
// 1. Schema (lib/schema.ts)
export const projectSchema = z.object({ ... });

// 2. Form Component (React Hook Form)
const form = useForm<z.infer<typeof projectSchema>>({
  resolver: zodResolver(projectSchema),
});

// 3. Server Action (app/actions.ts)
'use server'
export async function createProject(userId, data) {
  const validated = projectSchema.safeParse(data);
  if (!validated.success) return { errors, success: false };
  await db.collection('projects').add({...validated.data});
  revalidatePath('/dashboard/projects');
  return { success: true };
}

// 4. Toast в Client Component
const result = await createProject(userId, formData);
if (result.success) toast({ title: "Успех!" });
```

---

## 6. AI Integration (Genkit)

### Текущее состояние

```typescript
// src/ai/genkit.ts
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.0-flash",
});
```

**Статус:** Инициализация готова, **ни одного AI flow не реализовано**.

### Запланированные AI Flows

```
1. matchFreelancerToProject(projectId) → freelancerIds[]
   — Семантический поиск по навыкам, опыту, рейтингу

2. generateProjectDescription(keywords) → string
   — Помощь клиентам в написании ТЗ

3. rankProposals(projectId) → sortedProposalIds[]
   — Оценка и ранжирование заявок
```

**Как добавить новый flow:**

```typescript
// src/ai/flows/match-freelancer.ts
import { ai } from "../genkit";
import { z } from "zod";

export const matchFreelancerFlow = ai.defineFlow(
  {
    name: "matchFreelancer",
    inputSchema: z.object({ skills: z.array(z.string()), budget: z.number() }),
    outputSchema: z.array(z.string()),
  },
  async (input) => {
    const response = await ai.generate({
      prompt: `Find best matching freelancers for skills: ${input.skills.join(", ")}`,
    });
    return JSON.parse(response.text());
  },
);
```

---

## 7. Известные проблемы и технический долг

| Проблема                                                        | Приоритет | Решение                                                          |
| --------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| Все Server Actions в одном файле (`actions.ts` 1554 строки)     | MEDIUM    | Разбить на модули: `project-actions.ts`, `user-actions.ts`, etc. |
| Collection Group Query требует Firestore индекс                 | HIGH      | Создать composite индекс на `proposals` collection group         |
| `getDashboardStats()` для фрилансера: O(N) запросов к Firestore | MEDIUM    | Денормализация — хранить счётчики в профиле                      |
| Нет realtime-обновлений для уведомлений                         | HIGH      | Добавить `onSnapshot()` listener в `notification-bell.tsx`       |
| `/dashboard/messages` — пустая заглушка                         | HIGH      | Реализовать чат через Firestore realtime                         |
| Нет обработки Firebase Storage permissions                      | MEDIUM    | Настроить `storage.rules` для аватарок и портфолио               |
| `use-auth.ts` и `use-auth.tsx` — дубликаты                      | LOW       | Удалить один из файлов                                           |
| Telegram Bot токен должен быть в серверной переменной           | HIGH      | Убедиться что `TELEGRAM_BOT_TOKEN` не публичная                  |

---

## 8. Производительность

### Текущие оптимизации

- **Turbopack** включён для dev (`next dev --turbopack`)
- **revalidatePath** используется для ISR вместо полного SSR
- **Ограничение запросов** в `getProjects()` (limit 20)
- **server-side filtering** для talents/jobs

### Нужные оптимизации

- [ ] Добавить `React.Suspense` + `loading.tsx` для всех dashboard страниц
- [ ] Реализовать `error.tsx` boundary для критичных страниц
- [ ] `next/image` с `blur placeholder` для изображений портфолио
- [ ] Мемоизация тяжёлых компонентов (`React.memo`, `useMemo`)
- [ ] Firestore composite indexes для сложных запросов

---

## 9. Deployment

**Firebase App Hosting** (`apphosting.yaml`):

```yaml
# apphosting.yaml
runConfig:
  minInstances: 0 # Cold start
  maxInstances: 10
```

### CI/CD

Проект не имеет настроенного CI/CD pipeline. Рекомендуется:

1. GitHub Actions для автоматического деплоя при merge в `main`
2. Firebase Hosting предварительный просмотр для PR

### Команды деплоя

```bash
npm run build          # Сборка
firebase deploy        # Деплой на Firebase Hosting
# или через Firebase App Hosting - автоматически при push
```

---

## 10. Соглашения о коде

### Именование файлов

- Компоненты: `kebab-case.tsx` (e.g., `freelancer-dashboard.tsx`)
- Server Actions: все в `actions.ts`
- Хуки: `use-*.ts/tsx`
- Типы: в `schema.ts` с суффиксом `State`, `Schema`, или просто интерфейс

### Структура компонента

```typescript
'use client'; // если нужно

import { ... } // external
import { ... } // internal (@/...)

interface Props { ... }

export function ComponentName({ prop }: Props) {
  // hooks
  // handlers
  // derived state
  return ( ... );
}
```

### Server Actions Pattern

```typescript
"use server";
export async function actionName(params): Promise<StateType> {
  // 1. Auth check (getUserId)
  // 2. Input validation (zod)
  // 3. Business logic (Firestore)
  // 4. revalidatePath()
  // 5. Return { success, message, errors? }
}
```

---

_Документ поддерживается командой IshTop.Uz. При добавлении новых модулей — обновляйте соответствующие разделы._
