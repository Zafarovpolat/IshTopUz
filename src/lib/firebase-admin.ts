
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env.local (или других .env файлов)
dotenv.config();

let adminApp: admin.app.App | null = null;

function initializeAdminApp(): admin.app.App | null {
  // Если приложение уже инициализировано, возвращаем его.
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // Если ключ не найден, выводим четкое предупреждение и возвращаем null.
  if (!serviceAccountKey) {
    console.error("Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT_KEY не установлена. Серверная аутентификация не будет работать.");
    return null;
  }

  try {
    // Парсим ключ из строки.
    const serviceAccount = JSON.parse(serviceAccountKey);
    
    // Инициализируем приложение с учетными данными.
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (e: any) {
    console.error("Firebase Admin SDK: Не удалось разобрать FIREBASE_SERVICE_ACCOUNT_KEY. Убедитесь, что это корректный JSON. Ошибка:", e.message);
    return null;
  }
}

function getAdminApp(): admin.app.App | null {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}

export { getAdminApp };
