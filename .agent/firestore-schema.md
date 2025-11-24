# 🗄️ IshTop.Uz - Firestore Database Schema

## 📊 Обзор коллекций

```
Firestore Root
├── leads/                          # Лиды с лендинга
├── surveys/                        # Результаты опросов
├── users/                          # Профили пользователей
│   └── {userId}/
│       └── portfolio/              # Портфолио фрилансера (subcollection)
├── projects/                       # Проекты от клиентов
│   └── {projectId}/
│       └── proposals/              # Предложения фрилансеров (subcollection)
└── notifications/                  # Уведомления для пользователей
```

---

## 1️⃣ `leads/` - Лиды с лендинга

Коллекция для сбора контактов с главной страницы.

### Структура документа:
```typescript
{
  name: string;           // "Иван Петров"
  email: string;          // "ivan@example.com"
  role: 'Freelancer' | 'Client';
  createdAt?: Timestamp;  // Auto (если добавлено через FieldValue.serverTimestamp())
}
```

### Создается через:
- `submitLead()` Server Action
- Форма на лендинге (Hero section)

### Пример документа:
```json
{
  "name": "Алишер Усманов",
  "email": "alisher@gmail.com",
  "role": "Freelancer"
}
```

---

## 2️⃣ `surveys/` - Результаты опросов

Сбор детальной информации от потенциальных пользователей.

### Структура документа (Freelancer):
```typescript
{
  role: 'Freelancer';
  name: string;
  email: string;
  leadId?: string;              // Ссылка на документ из leads/
  profession?: string;          // "Веб-разработчик"
  experience?: string;          // "2-5 лет"
  platforms?: string[];         // ["Upwork", "Fiverr"]
  paymentIssues?: string;       // "Высокая комиссия"
  localPaymentSystems?: string; // "Да, важно"
  commissionAgreement?: string; // "5% - отлично"
  useTelegram?: string;         // "Да"
  desiredFeatures?: string;     // "AI-подбор проектов"
  betaTest?: string;            // "Да, готов"
}
```

### Структура документа (Client):
```typescript
{
  role: 'Client';
  name: string;
  email: string;
  leadId?: string;
  services?: string[];          // ["Веб-дизайн", "Копирайтинг"]
  businessType?: string;        // "Малый бизнес"
  platforms?: string[];         // ["Kwork", "Upwork"]
  qualityIssues?: string;       // "Низкое качество"
  localPaymentSystems?: string; // "Да"
  commissionAttractiveness?: string; // "5% - выгодно"
  useSocials?: string;          // "Instagram, Telegram"
  verificationValue?: string;   // "Важно"
  hiringDifficulties?: string;  // "Долгий поиск"
  betaTest?: string;            // "Да"
}
```

### Создается через:
- `submitSurvey()` Server Action
- Страница `/survey`

---

## 3️⃣ `users/{userId}` - Профили пользователей

**Главная коллекция** для всех зарегистрированных пользователей.

### Структура документа:
```typescript
{
  // === БАЗОВАЯ ИНФОРМАЦИЯ ===
  email: string;                   // "user@example.com"
  phone?: string;                  // "+998901234567"
  userType: 'freelancer' | 'client' | 'both';
  isVerified: boolean;             // Email verified?
  passwordSet?: boolean;           // Пароль установлен? (для Google auth users)
  profileComplete: boolean;        // Прошел ли онбординг
  
  // === TIMESTAMPS ===
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  updatedAt?: Timestamp;

  // === ПРОФИЛЬ (profile) ===
  profile: {
    firstName: string;             // "Алишер"
    lastName: string;              // "Усманов"
    avatar: string;                // URL изображения
    city?: string;                 // "Ташкент"
    country?: string;              // "Узбекистан"
    dateOfBirth?: string;          // "1995-03-15"
    gender?: string;               // "male" | "female"
    languages?: string[];          // ["Русский", "English", "O'zbek"]
    timezone?: string;             // "Asia/Tashkent"
  };

  // === КОШЕЛЕК (wallet) ===
  wallet: {
    balance: number;               // 1500000 (UZS)
    currency: string;              // "UZS"
    paymentMethods: Array<{
      id: string;
      type: 'payme' | 'uzcard' | 'humo';
      cardNumber: string;          // "8600 **** **** 1234"
      isDefault: boolean;
    }>;
    transactions: Array<{          // ⚠️ В будущем вынести в subcollection
      id: string;
      type: 'deposit' | 'withdrawal' | 'earning' | 'payment';
      amount: number;
      description: string;
      createdAt: Timestamp;
    }>;
  };

  // === ПРОФИЛЬ ФРИЛАНСЕРА (только если userType === 'freelancer') ===
  freelancerProfile?: {
    title: string;                 // "Senior Full-Stack Developer"
    description: string;           // "Опытный разработчик..."
    hourlyRate: number;            // 100000 (UZS/час)
    skills: string[];              // ["React", "Node.js", "TypeScript"]
    categories: string[];          // ["Web Development", "Mobile Apps"]
    experience: 'beginner' | 'intermediate' | 'expert';
    completedProjects: number;     // 42
    rating: number;                // 4.8 (0-5)
    reviewsCount: number;          // 24
    isAvailable: boolean;          // true
    lastActiveAt: Timestamp;
  };

  // === ПРОФИЛЬ КЛИЕНТА (только если userType === 'client') ===
  clientProfile?: {
    companyName?: string;          // "TechStartup LLC"
    companySize: '1' | '2-10' | '11-50' | '51+';
    industry?: string;             // "E-commerce"
    website?: string;              // "https://example.uz"
    description?: string;          // "Мы занимаемся..."
    projectsPosted: number;        // 15
    moneySpent: number;            // 50000000 (UZS)
    rating: number;                // 4.5 (0-5)
    reviewsCount: number;          // 12
  };
}
```

### Создается через:
- `createUserOnboarding()` - при первом входе
- Обновляется через `updateProfile()`

### Пример документа (Freelancer):
```json
{
  "email": "alisher@gmail.com",
  "phone": "+998901234567",
  "userType": "freelancer",
  "isVerified": false,
  "profileComplete": true,
  "createdAt": "2025-01-15T10:30:00Z",
  "lastLoginAt": "2025-01-20T14:22:00Z",
  "profile": {
    "firstName": "Алишер",
    "lastName": "Усманов",
    "avatar": "https://firebasestorage.googleapis.com/...",
    "city": "Ташкент",
    "country": "Узбекистан",
    "languages": ["Русский", "English"]
  },
  "wallet": {
    "balance": 2500000,
    "currency": "UZS",
    "paymentMethods": [],
    "transactions": []
  },
  "freelancerProfile": {
    "title": "Full-Stack Developer",
    "description": "8+ лет опыта в веб-разработке",
    "hourlyRate": 120000,
    "skills": ["React", "Next.js", "Node.js", "PostgreSQL"],
    "experience": "expert",
    "completedProjects": 34,
    "rating": 4.9,
    "reviewsCount": 18,
    "isAvailable": true
  }
}
```

---

## 3.1️⃣ `users/{userId}/portfolio/{itemId}` - Портфолио

**Subcollection** для работ фрилансера.

### Структура документа:
```typescript
{
  title: string;              // "Интернет-магазин электроники"
  description: string;        // "Разработал полноценный e-commerce..."
  imageUrl: string;           // URL превью изображения
  projectUrl?: string;        // "https://shop.example.uz"
  technologies: string[];     // ["Next.js", "Stripe", "PostgreSQL"]
  createdAt: Timestamp;
}
```

### Создается через:
- `addPortfolioItem()` Server Action
- Удаляется через `deletePortfolioItem()`

### Пример документа:
```json
{
  "title": "Landing страница для фитнес-клуба",
  "description": "Современный одностраничник с анимациями и формой записи",
  "imageUrl": "https://firebasestorage.googleapis.com/.../preview.jpg",
  "projectUrl": "https://fitclub.uz",
  "technologies": ["React", "Tailwind", "Framer Motion"],
  "createdAt": "2025-01-10T09:00:00Z"
}
```

---

## 4️⃣ `projects/{projectId}` - Проекты

Коллекция проектов, созданных клиентами.

### Структура документа:
```typescript
{
  // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
  title: string;                    // "Разработка корпоративного сайта"
  description: string;              // "Нужен современный сайт для..."
  skills: string[];                 // ["Web Design", "React", "SEO"]
  
  // === БЮДЖЕТ ===
  budgetType: 'fixed' | 'hourly';
  budgetAmount: number;             // 5000000 (UZS)
  
  // === ВЛАДЕЛЕЦ ===
  clientId: string;                 // userId клиента
  
  // === СТАТУС ===
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'closed';
  
  // === СТАТИСТИКА ===
  proposalsCount: number;           // 7 (автоинкремент)
  
  // === НАЗНАЧЕНИЕ ===
  freelancerId?: string;            // userId фрилансера (если принят)
  
  // === TIMESTAMPS ===
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  deadline?: Timestamp;             // "2025-02-15"
  completedAt?: Timestamp;          // "2025-02-10"
}
```

### Создается через:
- `createProject()` Server Action
- Обновляется через `updateProject()`

### Пример документа:
```json
{
  "title": "Логотип для кофейни",
  "description": "Ищу дизайнера для создания минималистичного логотипа...",
  "skills": ["Logo Design", "Branding", "Adobe Illustrator"],
  "budgetType": "fixed",
  "budgetAmount": 1500000,
  "clientId": "abc123userId",
  "status": "open",
  "proposalsCount": 3,
  "createdAt": "2025-01-18T12:00:00Z"
}
```

---

## 4.1️⃣ `projects/{projectId}/proposals/{proposalId}` - Предложения

**Subcollection** для предложений фрилансеров на проект.

### Структура документа:
```typescript
{
  freelancerId: string;         // userId фрилансера
  bidAmount: number;            // 1200000 (UZS)
  bidDuration: number;          // 7 (дней)
  coverLetter: string;          // "Здравствуйте! Я готов выполнить..."
  status: 'submitted' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### Создается через:
- `submitProposal()` Server Action
- Обновляется через `updateProposal()`
- Удаляется через `deleteProposal()`

### Пример документа:
```json
{
  "freelancerId": "xyz789userId",
  "bidAmount": 1200000,
  "bidDuration": 5,
  "coverLetter": "Здравствуйте! Имею опыт в создании логотипов для HoReCa...",
  "status": "submitted",
  "createdAt": "2025-01-18T14:30:00Z"
}
```

---

## 5️⃣ `notifications/{notificationId}` - Уведомления

Коллекция уведомлений для пользователей.

### Структура документа:
```typescript
{
  recipientId: string;          // userId получателя
  senderId?: string;            // userId отправителя (если применимо)
  senderName?: string;          // "Алишер Усманов"
  
  type: 'new_proposal' | 'proposal_accepted' | 'project_completed' | 'invitation' | 'message';
  
  message: string;              // "Алишер Усманов оставил отклик на ваш проект..."
  
  entityId?: string;            // ID связанной сущности (projectId, proposalId)
  entityType?: 'project' | 'proposal' | 'message';
  
  isRead: boolean;              // false
  createdAt: Timestamp;
}
```

### Создается через:
- `submitProposal()` - автоматически создает уведомление клиенту
- Будущие Server Actions для других типов

### Пример документа:
```json
{
  "recipientId": "client123",
  "senderId": "freelancer456",
  "senderName": "Дильшод Эргашев",
  "type": "new_proposal",
  "message": "Дильшод Эргашев оставил отклик на ваш проект \"Логотип для кофейни\"",
  "entityId": "project789",
  "entityType": "project",
  "isRead": false,
  "createdAt": "2025-01-18T14:35:00Z"
}
```

---

## 🔐 Security Rules (storage.rules)

Базовые правила безопасности Firebase:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - могут читать/писать только свой документ
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      
      // Portfolio - публичное чтение, запись только владельцу
      match /portfolio/{itemId} {
        allow read: if true;
        allow write: if request.auth.uid == userId;
      }
    }
    
    // Projects - публичное чтение, запись только клиенту
    match /projects/{projectId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.clientId;
      
      // Proposals - запись только фрилансерам
      match /proposals/{proposalId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.freelancerId;
      }
    }
    
    // Notifications - чтение только получателем
    match /notifications/{notificationId} {
      allow read: if request.auth.uid == resource.data.recipientId;
      allow write: if request.auth != null;
    }
    
    // Leads & Surveys - публичная запись, админ чтение
    match /leads/{leadId} {
      allow write: if true;
    }
    match /surveys/{surveyId} {
      allow write: if true;
    }
  }
}
```

---

## 📊 Индексы (рекомендации для Firestore)

Для оптимизации запросов:

### Projects:
```
Index: (clientId ASC, createdAt DESC)
Index: (status ASC, createdAt DESC)
Index: (skills ARRAY, createdAt DESC)
```

### Notifications:
```
Index: (recipientId ASC, isRead ASC, createdAt DESC)
```

### Proposals:
```
Index: (freelancerId ASC, createdAt DESC)
Index: (status ASC, createdAt DESC)
```

---

## 🔄 Миграция данных (будущее)

### Планируется вынести в отдельные коллекции:
- `wallet.transactions` → `users/{userId}/transactions/` (subcollection)
- `reviews/` - отзывы о проектах и фрилансерах
- `messages/` - чат между клиентом и фрилансером
- `contracts/` - договоры и escrow

---

**Последнее обновление**: 2025-11-20
