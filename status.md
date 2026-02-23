# IshTop.Uz — Freelance Marketplace для Узбекистана

## 🎯 Текущий статус: **Beta MVP (75% готовности)**

_Обновлено: 2026-02-23_

---

## ✅ РЕАЛИЗОВАНО И РАБОТАЕТ

### 🔐 Аутентификация

- [x] Регистрация/вход через Email + Password
- [x] Вход через Google OAuth
- [x] Вход через Telegram (Bot API)
- [x] Session Cookies (Firebase Admin SDK)
- [x] Middleware — защита приватных маршрутов
- [x] Set-Password flow для OAuth-пользователей
- [x] Повторная авторизация при смене email

### 👤 Онбординг и Профили

- [x] Онбординг — выбор роли (freelancer / client)
- [x] Профиль фрилансера (имя, город, ставка, навыки, опыт, языки, статус доступности)
- [x] Профиль клиента (компания, индустрия, сайт, описание)
- [x] Загрузка аватара (Firebase Storage)
- [x] Обновление email через Firebase Auth (с проверкой конфликтов)

### 📋 Проекты (Jobs Board)

- [x] Создание проектов (fixed/hourly, дедлайн, навыки, описание)
- [x] Редактирование проектов
- [x] Статусы: `open | in_progress | completed | closed`
- [x] Черновики проектов (`draft`)
- [x] Jobs Board с фильтрами (бюджет, категория, ключевые слова)
- [x] Сортировка (новые, бюджет по возрастанию/убыванию)
- [x] Пагинация (20 проектов на страницу)
- [x] Детальная страница проекта

### 💼 Предложения (Proposals)

- [x] Подача заявок фрилансером (ставка, срок, сопроводительное письмо)
- [x] Обновление/удаление заявки
- [x] Защита видимости: клиент видит все, фрилансер — только свою
- [x] Проверка дублей (нельзя подать дважды)
- [x] Счётчик proposals на проекте (`proposalsCount`)

### 👥 Биржа талантов (Talents)

- [x] Каталог фрилансеров из Firestore
- [x] Фильтры (категория, почасовая ставка, рейтинг)
- [x] Поиск по навыкам (client-side filtering)

### 🎨 Портфолио

- [x] Добавление работ (название, описание, URL, технологии, изображение)
- [x] Удаление с проверкой прав доступа (security check)
- [x] Пагинация при > 10 работ
- [x] Просмотр в модальном окне

### 📊 Dashboard

- [x] Статистика фрилансера (earnings, активные проекты, рейтинг, totalProposals)
- [x] Статистика клиента (moneySpent, activeProjects, hiredFreelancers, totalProposalsReceived)
- [x] Таб «Мои проекты» (активные, завершённые, поданные заявки)
- [x] Таб «Предложения» (отправленные / полученные, заглушки для saved/invitations)
- [x] Рекомендованные проекты на основе навыков фрилансера (базовый матчинг)

### 💰 Финансы (базовая версия)

- [x] `completeProject()` — начисление оплаты фрилансеру с комиссией 5%
- [x] `getWalletTransactions()` — история транзакций из Firestore
- [x] `addPaymentMethod()` / `deletePaymentMethod()` / `setDefaultPaymentMethod()`
- [x] Wallet: UZS баланс, история транзакций
- [x] График доходов по месяцам (`earnings-chart.tsx`)
- [x] Mock-вывод средств (toast: «Интеграция Payme в разработке»)

### 🔔 Уведомления

- [x] `getNotifications()` / `markAsRead()` / `markAllAsRead()`
- [x] Notification Bell с badge непрочитанных
- [x] Dropdown с уведомлениями в хедере
- [x] Создание уведомлений при новом proposal, принятии, завершении проекта

### ⚙️ Настройки

- [x] `updatePassword()` — смена пароля через Firebase Auth
- [x] `updateNotificationSettings()` — сохранение переключателей в Firestore
- [x] `updatePrivacySettings()` — видимость профиля (`profile.visibility`)

### 📝 Survey & Landing

- [x] Landing Page
- [x] Lead captures → Firestore `leads/`
- [x] Опросник фрилансеров и клиентов → Firestore `surveys/`
- [x] About, Contacts, Privacy Policy, Terms of Use страницы

---

## ⚠️ ЧАСТИЧНО РЕАЛИЗОВАНО

| Модуль                     | Статус           | Проблема                                                     |
| -------------------------- | ---------------- | ------------------------------------------------------------ |
| Dashboard сообщения        | страница есть    | `/dashboard/messages` — пустая заглушка                      |
| Saved Projects/Freelancers | табы есть        | только UI, без данных                                        |
| Invitations                | табы есть        | только UI, логика отсутствует                                |
| Биржа талантов (Kworks)    | страница есть    | `/marketplace` — hardcoded dummy данные                      |
| Уведомления realtime       | базовые есть     | нет realtime-listener, Badge не обновляется без перезагрузки |
| Рекомендации               | базовый алгоритм | нет ML/AI — простое совпадение строк по навыкам              |

---

## ❌ НЕ РЕАЛИЗОВАНО

| Фича                          | Приоритет | Примечание                                    |
| ----------------------------- | --------- | --------------------------------------------- |
| 💬 Чат между пользователями   | HIGH      | Нет ни backend, ни UI                         |
| 💳 Реальные платежи (Payme)   | HIGH      | Только mock toast                             |
| 🔒 Escrow система             | HIGH      | Логика удержания средств до завершения        |
| 🤖 AI matching (Genkit flows) | MEDIUM    | `genkit.ts` настроен, нет ни одного flow      |
| 🌍 Локализация (uz/en)        | MEDIUM    | Весь интерфейс только на русском              |
| ⭐ Система отзывов/рейтингов  | MEDIUM    | Поле rating есть в schema, нет UI             |
| 📧 Email-уведомления          | LOW       | Нет интеграции (SendGrid/Firebase Extensions) |
| 🔗 Hire-in-Uzbekistan landing | LOW       | Страница создана, контент не заполнен         |
| 📱 PWA / мобильное приложение | FUTURE    | Не планировалось                              |
| 🛡️ Admin панель               | FUTURE    | Нет                                           |

---

## 🛠️ Технологический стек

| Слой     | Технология                       | Версия  |
| -------- | -------------------------------- | ------- |
| Frontend | Next.js (App Router)             | 15.3.3  |
| Language | TypeScript                       | ^5      |
| Styling  | Tailwind CSS + Radix UI          | ^3.4    |
| Forms    | React Hook Form + Zod            | ^7 / ^3 |
| Charts   | Recharts                         | ^2.15   |
| Backend  | Next.js Server Actions           | —       |
| Database | Firebase Firestore               | ^10.12  |
| Auth     | Firebase Auth + Admin SDK        | ^13.5   |
| Storage  | Firebase Storage                 | ^10.12  |
| Hosting  | Firebase App Hosting             | —       |
| AI       | Google Genkit + Gemini 2.0 Flash | ^1.14   |

---

## 📁 Структура Firestore

```
users/{uid}
  ├── userType: 'freelancer' | 'client'
  ├── email, phone, isVerified
  ├── passwordSet: boolean
  ├── profileComplete: boolean
  ├── profile: { firstName, lastName, avatar, city, country, ... }
  ├── freelancerProfile?: { title, hourlyRate, skills[], rating, isAvailable, ... }
  ├── clientProfile?: { companyName, companySize, industry, moneySpent, ... }
  ├── wallet: { balance, currency: 'UZS', paymentMethods[], transactions[] }
  └── portfolio/ (subcollection)
        └── {itemId}: { title, description, imageUrl, technologies[], createdAt }

projects/{projectId}
  ├── title, description, skills[], budgetType, budgetAmount
  ├── status: 'open' | 'in_progress' | 'completed' | 'closed'
  ├── clientId, freelancerId?, proposalsCount
  ├── deadline?, completedAt?
  └── proposals/ (subcollection)
        └── {proposalId}: { freelancerId, bidAmount, bidDuration, coverLetter, status }

notifications/{id}
  ├── recipientId, senderId, type, message
  ├── entityId, entityType, isRead, createdAt

surveys/{id}  — опросы с landing page
leads/{id}    — заявки с landing page
```

---

## 🚀 Следующий этап (Post-MVP)

**Приоритет 1 — Критично для монетизации:**

1. Интеграция Payme (реальные платежи)
2. Escrow система (hold / release funds)
3. Чат между пользователями (Firestore realtime)

**Приоритет 2 — Рост:** 4. AI matching с Genkit flows (умные рекомендации) 5. Система отзывов и рейтингов 6. Локализация (узбекский, английский) 7. Email-уведомления (Firebase Extensions + SendGrid)

**Приоритет 3 — Масштабирование:** 8. Admin-панель 9. Аналитика (Mixpanel / Firebase Analytics) 10. PWA или мобильное приложение

---

## 🔧 Быстрый старт

```bash
git clone https://github.com/Zafarovpolat/IshTopUz
cd IshTopUz
npm install
# Создай .env.local с Firebase credentials (см. .env.local.example)
npm run dev  # http://localhost:9002
```

**Переменные окружения (`.env.local`):**

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
```

📝 **License:** MIT
