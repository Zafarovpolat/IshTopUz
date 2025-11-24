# 🏗️ IshTop.Uz - Техническая Архитектура

## 📦 Технологический стек

### Frontend
- ⚛️ **Next.js 15.3.3** (App Router)
- 📘 **TypeScript 5.x**
- 🎨 **Tailwind CSS 3.4.1**
- 🧩 **Radix UI** (компонентная библиотека)
- 🔥 **React Hook Form** + **Zod** (валидация форм)
- 📊 **Recharts 2.15.1** (графики и диаграммы)
- 🖼️ **Embla Carousel** (карусели)

### Backend
- 🔥 **Firebase 10.12.3**
  - Authentication (Email/Password + Google OAuth)
  - Firestore Database
  - Storage (загрузка файлов)
- 🔐 **Firebase Admin SDK 13.5.0** (server-side операции)
- 🤖 **Genkit AI 1.14.1** (Google AI интеграция для будующего AI-matching)

### Архитектурный подход
- 🎯 **Server Actions** (Next.js) для всех операций с БД
- 🔒 **Middleware** для защиты маршрутов
- 🍪 **Session Cookies** для аутентификации
- 📱 **Mobile First** подход в дизайне

---

## 📁 Структура проекта

```
IshTopUz/
├── .agent/                    # 📚 Документация проекта
│   ├── project-overview.md
│   ├── architecture.md
│   └── firestore-schema.md
│
├── src/
│   ├── app/                   # 📄 Next.js App Router
│   │   ├── actions.ts         # 🔥 14 Server Actions (919 строк)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Лендинг
│   │   ├── globals.css        # Глобальные стили
│   │   │
│   │   ├── auth/              # 🔐 Аутентификация
│   │   │   └── page.tsx
│   │   │
│   │   ├── onboarding/        # 👤 Онбординг новых пользователей
│   │   │   └── page.tsx
│   │   │
│   │   ├── set-password/      # 🔑 Установка пароля
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/         # 📊 Защищенная зона (freelancer/client)
│   │   │   ├── page.tsx       # Главная дашборда
│   │   │   ├── layout.tsx     # Layout с сайдбаром
│   │   │   ├── profile/       # Профиль
│   │   │   ├── projects/      # Мои проекты
│   │   │   ├── offers/        # Предложения
│   │   │   ├── portfolio/     # Портфолио (только freelancer)
│   │   │   ├── finances/      # Финансы и кошелек
│   │   │   ├── messages/      # Сообщения (в разработке)
│   │   │   └── settings/      # Настройки
│   │   │
│   │   ├── jobs/              # 💼 Биржа проектов
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx  # Детали проекта
│   │   │
│   │   ├── talents/           # 👥 Биржа фрилансеров
│   │   │   └── page.tsx
│   │   │
│   │   ├── marketplace/       # 🛒 Маркетплейс
│   │   │   └── jobs/[id]/page.tsx
│   │   │
│   │   ├── portfolio/         # 🎨 Публичное портфолио
│   │   │   └── [id]/page.tsx
│   │   │
│   │   ├── survey/            # 📝 Опросы
│   │   ├── about/             # О платформе
│   │   ├── contacts/          # Контакты
│   │   ├── privacy-policy/    # Политика конфиденциальности
│   │   └── terms-of-use/      # Условия использования
│   │
│   ├── components/            # 🧩 React компоненты
│   │   ├── auth-form.tsx      # Форма авторизации
│   │   ├── onboarding-form.tsx
│   │   ├── set-password-form.tsx
│   │   ├── profile-form.tsx
│   │   ├── project-details-client.tsx
│   │   │
│   │   ├── dashboard/         # 📊 37 компонентов дашборда
│   │   │   ├── freelancer-dashboard.tsx
│   │   │   ├── client-dashboard.tsx
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-sidebar.tsx
│   │   │   ├── notification-bell.tsx
│   │   │   ├── portfolio-form.tsx
│   │   │   ├── portfolio-list.tsx
│   │   │   │
│   │   │   ├── projects/      # 8 компонентов
│   │   │   │   ├── freelancer-projects-page.tsx
│   │   │   │   ├── client-projects-page.tsx
│   │   │   │   ├── active-projects-tab.tsx
│   │   │   │   ├── completed-projects-tab.tsx
│   │   │   │   ├── client-active-projects-tab.tsx
│   │   │   │   ├── client-completed-projects-tab.tsx
│   │   │   │   ├── drafts-tab.tsx
│   │   │   │   └── project-form.tsx
│   │   │   │
│   │   │   ├── offers/        # 8 компонентов
│   │   │   │   ├── freelancer-offers-page.tsx
│   │   │   │   ├── client-offers-page.tsx
│   │   │   │   ├── sent-offers-tab.tsx
│   │   │   │   ├── saved-projects-tab.tsx
│   │   │   │   ├── invitations-tab.tsx
│   │   │   │   └── client/ (3 компонента)
│   │   │   │
│   │   │   ├── finances/      # 10 компонентов
│   │   │   │   ├── freelancer-finances-page.tsx
│   │   │   │   ├── client-finances-page.tsx
│   │   │   │   ├── overview-tab.tsx
│   │   │   │   ├── earnings-chart.tsx
│   │   │   │   ├── withdrawal-methods-tab.tsx
│   │   │   │   ├── reports-tab.tsx
│   │   │   │   └── client/ (4 компонента)
│   │   │   │
│   │   │   └── settings/      # 3 компонента
│   │   │       ├── security-tab.tsx
│   │   │       ├── notifications-tab.tsx
│   │   │       └── privacy-tab.tsx
│   │   │
│   │   ├── sections/          # 🌟 Секции лендинга
│   │   │   ├── hero.tsx
│   │   │   ├── benefits.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── contact-form.tsx
│   │   │   ├── cta.tsx
│   │   │   └── survey-form.tsx
│   │   │
│   │   ├── layout/            # 📐 Layout компоненты
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   └── ui/                # 🎨 35 UI компонентов (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       └── ... (26 других)
│   │
│   ├── lib/                   # 🛠️ Утилиты и конфигурация
│   │   ├── schema.ts          # 🎯 Zod схемы валидации (245 строк)
│   │   ├── firebase.ts        # Firebase Client SDK
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   ├── auth.ts            # Функции аутентификации (126 строк)
│   │   ├── get-user-data.ts   # Server-side получение данных юзера
│   │   ├── dashboard-nav.ts   # Конфигурация навигации
│   │   ├── utils.ts           # cn() helper
│   │   ├── survey-questions.ts # Вопросы для опросов
│   │   └── placeholder-images.json
│   │
│   ├── hooks/                 # 🎣 React Hooks
│   │   ├── use-auth.ts        # AuthContext + Provider
│   │   └── use-toast.ts       # Toast уведомления
│   │
│   ├── ai/                    # 🤖 Genkit AI
│   │   ├── genkit.ts
│   │   └── dev.ts
│   │
│   └── middleware.ts          # 🔒 Route protection
│
├── public/                    # 🖼️ Статические файлы
│
├── .agent/workflows/          # 🔄 Workflows (если будут)
│
├── tasks.md                   # ✅ Roadmap (80 задач)
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                 # 🔐 Firebase config (gitignored)
├── .firebaserc
├── apphosting.yaml
└── README.md
```

---

## 🔐 Аутентификация и авторизация

### Схема auth flow:

```
1. User заходит на /auth
2. Выбирает вход через:
   - Email/Password (signInWithEmail)
   - Google OAuth (signInWithGoogle)
3. Firebase Auth создает пользователя
4. Server Action createUserOnboarding():
   - Создает документ в users/{userId}
   - Устанавливает userType: 'freelancer' | 'client'
   - Создает session cookie
5. Redirect на /dashboard
6. Middleware проверяет session cookie
7. getUserData() получает данные из Firestore
8. Рендерится FreelancerDashboard или ClientDashboard
```

### Защита маршрутов (middleware.ts):
```typescript
protectedPaths = ['/dashboard', '/onboarding', '/set-password']
- Если нет session cookie → redirect /auth
- Если есть cookie и заходит на /auth → redirect /dashboard
```

---

## 🗄️ Server Actions (actions.ts)

**14 Server Actions** для работы с Firestore:

### 1. Lead & Survey:
- `submitLead()` - Сохранение лида с лендинга  
- `submitSurvey()` - Отправка опроса (Freelancer/Client)

### 2. User Management:
- `createUserOnboarding()` - Создание профиля (448 строк!)
- `updateProfile()` - Обновление профиля
- `setUserPassword()` - Установка пароля

### 3. Portfolio (Freelancer):
- `addPortfolioItem()` - Добавить работу в портфолио
- `deletePortfolioItem()` - Удалить работу

### 4. Projects (Client):
- `createProject()` - Создать проект
- `updateProject()` - Обновить проект
- `getProjectsByClientId()` - Получить проекты клиента

### 5. Proposals (Freelancer):
- `submitProposal()` - Подать предложение на проект
- `updateProposal()` - Обновить предложение
- `deleteProposal()` - Удалить предложение

**Все Server Actions:**
- Используют Zod для валидации
- Работают через Firebase Admin SDK
- Возвращают typed responses (State types)
- Делают revalidatePath() для обновления UI

---

## 🎨 UI/UX подход

### Design System:
- **shadcn/ui** - библиотека компонентов (35 штук)
- **Tailwind CSS** - кастомная цветовая палитра через CSS variables
- **Radix UI** - доступные примитивы

### Цветовая схема (globals.css):
```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --destructive
--card, --popover, --border, --ring
```

### Типографика:
- **Inter** (Google Fonts) - основной шрифт

---

## 🚀 Deployment

### Development:
```bash
npm run dev  # localhost:9002 (turbopack enabled)
```

### Production:
- **Firebase Hosting**
- Build config: `ignoreBuildErrors: true` (TypeScript/ESLint)
- Images: Remote patterns (placehold.co, firebasestorage, picsum.photos)

---

## 🔄 Data Flow (Пример: Подача proposal)

```
1. User (Freelancer) на /marketplace/jobs/[id]
2. Заполняет форму (React Hook Form + Zod)
3. onSubmit → вызывает Server Action submitProposal()
4. Server Action:
   a. Валидирует данные (proposalSchema)
   b. Проверяет дубликаты (нет ли уже proposal от этого юзера)
   c. Добавляет в projects/{projectId}/proposals/
   d. Increment proposalsCount на проекте
   e. Создает notification для клиента
   f. revalidatePath()
5. UI автоматически обновляется
6. Toast: "Ваше предложение успешно отправлено!"
```

---

## 📊 Performance & Optimization

### Текущие оптимизации:
- ✅ Next.js Server Components (where applicable)
- ✅ Image optimization (next/image)
- ✅ Code splitting (automatic via Next.js)
- ✅ Turbopack в dev mode

### Планируется:
- 🔄 Lazy loading компонентов
- 🔄 React.memo для тяжелых компонентов
- 🔄 Debounce для поисковых фильтров
- 🔄 Virtualization для длинных списков

---

## 🐛 Важные замечания

### TypeScript & ESLint:
```typescript
// next.config.ts
typescript: { ignoreBuildErrors: true }
eslint: { ignoreDuringBuilds: true }
```
**Причина**: Проект в активной разработке, приоритет — скорость итераций.

### Firebase Config:
`.env.local` содержит все ключи Firebase и **игнорируется git**.  
Для локального запуска нужно попросить keys у владельца проекта.

---

**Последнее обновление**: 2025-11-20
