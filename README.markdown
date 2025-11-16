# IshTop.Uz - Freelance Marketplace для Узбекистана

## 🎯 Текущий статус: **Beta Development (45% готовности)**

### ✅ Что РАБОТАЕТ:
- ✅ Аутентификация (Email, Google, Telegram)
- ✅ Профили пользователей (freelancer/client)
- ✅ Создание проектов
- ✅ Подача предложений (proposals)
- ✅ Биржа проектов (Jobs Board)
- ✅ Портфолио фрилансеров
- ✅ Система опросов (Survey)
- ✅ Landing Page

### ⚠️ В разработке:
- ⚠️ Dashboard (UI готов, данные hardcoded)
- ⚠️ Биржа талантов (UI готов, backend нет)
- ⚠️ Каталог услуг (Kworks - не приоритет)

### ❌ Не реализовано:
- ❌ Финансы (wallet не используется)
- ❌ Платежи (Payme/HUMO интеграция)
- ❌ Escrow система
- ❌ Чат между пользователями
- ❌ Уведомления (UI есть, backend нет)
- ❌ AI matching (Genkit настроен, flows нет)
- ❌ Локализация (только русский)

## 🛠️ Технологии (РЕАЛЬНЫЕ):

**Frontend:**
- Next.js 15.3 (App Router)
- TypeScript
- Tailwind CSS + Radix UI
- React Hook Form + Zod

**Backend:**
- Next.js Server Actions
- Firebase Firestore (database)
- Firebase Auth (session cookies)
- Firebase Storage (images)

**Hosting:**
- Firebase App Hosting

**НЕ используется:**
- ❌ PostgreSQL (в планах было, но Firestore)
- ❌ Redis (не нужен с Firestore)
- ❌ WebSocket (можно Firestore realtime)

## 🚀 Roadmap to MVP (2 месяца):

**Месяц 1 - Core Features:**
- Week 1-2: Пофиксить Telegram auth, подключить реальные данные к Dashboard
- Week 3-4: Реализовать "Мои проекты" и "Предложения" страницы

**Месяц 2 - Payments:**
- Week 5-6: Интеграция Payme (тестовый режим)
- Week 7-8: Escrow система (hold/release funds)

## 📁 Структура Firestore:
users/{uid}
├── userType: 'freelancer' | 'client'
├── profile: { firstName, lastName, avatar, ... }
├── freelancerProfile?: { ... }
├── clientProfile?: { ... }
├── wallet: { balance, transactions[] }
└── portfolio (subcollection)

projects/{projectId}
├── title, description, skills[], budgetAmount
├── status: 'open' | 'in_progress' | 'completed'
└── proposals (subcollection)

surveys/{id}, leads/{id}, notifications/{id}

text


## 🔧 Setup:

```bash
npm install
# Добавь .env.local с Firebase credentials
npm run dev
📝 License: MIT
