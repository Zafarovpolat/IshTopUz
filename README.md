# 🇺🇿 IshTop.Uz — Freelance Marketplace for Uzbekistan

> Платформа для поиска фрилансеров и заказчиков в Узбекистане. Аналог Upwork, адаптированный под местный рынок с поддержкой Payme и локальных платёжных систем.

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=nextdotjs)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Основные возможности

| Для фрилансеров                 | Для заказчиков                    |
| ------------------------------- | --------------------------------- |
| Создание профиля с портфолио    | Публикация и управление проектами |
| Поиск проектов с фильтрами      | Поиск фрилансеров с фильтрами     |
| Подача предложений (proposals)  | Получение и просмотр предложений  |
| Отслеживание заработка (wallet) | История расходов                  |
| Dashboard со статистикой        | Dashboard со статистикой          |
| Уведомления о новых проектах    | Уведомления о новых откликах      |

---

## 🛠 Технологический стек

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Server Actions)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + [Radix UI](https://radix-ui.com)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (Email, Google, Telegram)
- **Storage:** Firebase Storage
- **AI:** Google Genkit + Gemini 2.0 Flash _(configured, flows in progress)_
- **Hosting:** Firebase App Hosting

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- npm или yarn
- Firebase проект с включёнными сервисами: Auth, Firestore, Storage

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Zafarovpolat/IshTopUz
cd IshTopUz

# Установить зависимости
npm install

# Создать файл с переменными окружения
cp .env.local.example .env.local
# Заполни .env.local своими Firebase credentials

# Запустить в режиме разработки
npm run dev
```

Откройте [http://localhost:9002](http://localhost:9002)

### Переменные окружения (`.env.local`)

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com

# Google AI (для Genkit)
GOOGLE_GENAI_API_KEY=your_genai_api_key

# Telegram Bot (для Telegram Auth)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

---

## 📁 Структура проекта

```
src/
├── ai/                    # Genkit AI конфигурация
│   ├── genkit.ts          # Инициализация (Gemini 2.0 Flash)
│   └── dev.ts
├── app/                   # Next.js App Router
│   ├── actions.ts         # Все Server Actions (~1554 строк, 30+ функций)
│   ├── page.tsx           # Landing Page
│   ├── auth/              # Страница входа/регистрации
│   ├── onboarding/        # Онбординг (выбор роли)
│   ├── set-password/      # Установка пароля (для OAuth)
│   ├── dashboard/         # Приватный дашборд
│   │   ├── layout.tsx     # Sidebar + Header
│   │   ├── page.tsx       # Главная дашборда
│   │   ├── profile/       # Профиль пользователя
│   │   ├── projects/      # Мои проекты
│   │   ├── offers/        # Предложения и заявки
│   │   ├── portfolio/     # Портфолио фрилансера
│   │   ├── finances/      # Финансы / Wallet
│   │   ├── settings/      # Настройки аккаунта
│   │   └── messages/      # Чат (заглушка)
│   ├── jobs/              # Биржа проектов
│   ├── talents/           # Каталог фрилансеров
│   ├── marketplace/       # Детали проектов + Kworks
│   ├── survey/            # Опросник для новых пользователей
│   └── ...                # About, Contacts, Legal pages
├── components/
│   ├── ui/                # Radix UI компоненты (35 штук)
│   ├── layout/            # Header, Footer, Navigation
│   ├── sections/          # Секции Landing Page
│   ├── dashboard/         # Компоненты дашборда
│   │   ├── freelancer-dashboard.tsx
│   │   ├── client-dashboard.tsx
│   │   ├── projects/      # Табы проектов
│   │   ├── offers/        # Табы предложений
│   │   ├── finances/      # Финансовые компоненты
│   │   ├── settings/      # Табы настроек
│   │   └── notification-bell.tsx
│   ├── auth-form.tsx      # Форма входа/регистрации
│   ├── onboarding-form.tsx
│   ├── profile-form.tsx
│   └── project-details-client.tsx
├── hooks/
│   ├── use-auth.ts        # useAuth hook (Firebase client)
│   ├── use-mobile.tsx     # isMobile hook
│   └── use-toast.ts       # Toast уведомления
└── lib/
    ├── schema.ts          # Zod схемы + TypeScript типы
    ├── firebase.ts        # Firebase Client SDK
    ├── firebase-admin.ts  # Firebase Admin SDK
    ├── auth.ts            # Server-side auth helpers
    ├── get-user-data.ts   # getUserId() helper
    ├── dashboard-nav.ts   # Навигация дашборда
    └── survey-questions.ts
```

---

## 🔑 Аутентификация

Платформа использует **Firebase Authentication** с тремя провайдерами:

1. **Email/Password** — стандартный вход
2. **Google OAuth** — один клик
3. **Telegram** — через Telegram Bot API

Сессия хранится в **cookie** (server-side, `httpOnly`). Middleware (`src/middleware.ts`) защищает маршруты `/dashboard`, `/onboarding`, `/set-password`.

Для Google/Telegram пользователей предусмотрен flow установки пароля (`/set-password`), чтобы пользователь мог войти на любом устройстве.

---

## 📜 Доступные скрипты

```bash
npm run dev          # Запуск dev-сервера (порт 9002, Turbopack)
npm run build        # Production сборка
npm run start        # Запуск production сервера
npm run lint         # ESLint проверка
npm run typecheck    # TypeScript проверка без сборки
npm run genkit:dev   # Запуск Genkit dev UI
npm run genkit:watch # Genkit в режиме watch
```

---

## 🗃 Firestore Data Model

```
users/{uid}
  profile: { firstName, lastName, avatar, city, country, ... }
  freelancerProfile?: { title, hourlyRate, skills[], rating, isAvailable }
  clientProfile?: { companyName, industry, moneySpent }
  wallet: { balance: UZS, paymentMethods[], transactions[] }
  portfolio/ → { title, imageUrl, technologies[], projectUrl }

projects/{id}
  status: open | in_progress | completed | closed
  proposals/ → { freelancerId, bidAmount, coverLetter, status }

notifications/{id}
  type: new_proposal | proposal_accepted | project_completed
  recipientId, isRead, createdAt

leads/{id}     → Landing page sign-ups
surveys/{id}   → Freelancer/Client survey responses
```

---

## 🤖 AI (Genkit)

Проект использует [Google Genkit](https://firebase.google.com/docs/genkit) с моделью **Gemini 2.0 Flash**. Конфигурация готова (`src/ai/genkit.ts`).

**В планах:**

- AI-матчинг фрилансеров к проектам
- Умные рекомендации
- Автоматическая проверка портфолио

---

## 📊 Текущий прогресс

| Модуль              | Готовность |
| ------------------- | ---------- |
| Аутентификация      | ✅ 100%    |
| Профили             | ✅ 100%    |
| Проекты (CRUD)      | ✅ 100%    |
| Proposals           | ✅ 100%    |
| Портфолио           | ✅ 100%    |
| Dashboard           | ✅ 95%     |
| Финансы (базовые)   | ✅ 90%     |
| Уведомления         | ✅ 85%     |
| Настройки           | ✅ 100%    |
| Биржа талантов      | ✅ 80%     |
| Чат/Сообщения       | ❌ 0%      |
| Реальные платежи    | ❌ 0%      |
| Escrow              | ❌ 0%      |
| AI Flows            | ❌ 10%     |
| Локализация (uz/en) | ❌ 0%      |

---

## 🤝 Участие в разработке

1. Fork репозитория
2. Создай ветку: `git checkout -b feature/your-feature`
3. Закоммить изменения: `git commit -m 'Add: your feature'`
4. Push: `git push origin feature/your-feature`
5. Открой Pull Request

---

## 📝 Лицензия

[MIT](LICENSE) © 2024-2026 IshTop.Uz Team
