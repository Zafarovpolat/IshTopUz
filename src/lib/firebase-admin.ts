
import admin from 'firebase-admin';

// Определяем интерфейс для нашего глобального пространства имен
declare global {
  // eslint-disable-next-line no-var
  var __firebaseAdminApp__: admin.app.App | undefined;
}

function initializeAdminApp(): admin.app.App {
  // Проверяем, было ли приложение уже инициализировано и сохранено глобально
  if (global.__firebaseAdminApp__) {
    return global.__firebaseAdminApp__;
  }
  
  // Также проверяем стандартный массив `admin.apps` на всякий случай
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    console.error("Firebase Admin SDK: Переменная окружения FIREBASE_SERVICE_ACCOUNT не установлена. Серверная аутентификация не будет работать.");
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set.");
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    // Сохраняем инициализированное приложение в глобальную переменную
    global.__firebaseAdminApp__ = app;
    
    return app;
  } catch (e: any) {
    console.error("Firebase Admin SDK: Не удалось разобрать содержимое FIREBASE_SERVICE_ACCOUNT. Убедитесь, что это корректный JSON без лишних символов и переносов строк. Ошибка:", e.message);
    throw new Error("Failed to initialize Firebase Admin SDK.");
  }
}

export function getAdminApp(): admin.app.App {
  return initializeAdminApp();
}
