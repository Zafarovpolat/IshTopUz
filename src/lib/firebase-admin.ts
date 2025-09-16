
import admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function initializeAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    console.error("Firebase Admin SDK: Переменная окружения FIREBASE_SERVICE_ACCOUNT не установлена. Серверная аутентификация не будет работать.");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (e: any) {
    console.error("Firebase Admin SDK: Не удалось разобрать содержимое FIREBASE_SERVICE_ACCOUNT. Убедитесь, что это корректный JSON без лишних символов и переносов строк. Ошибка:", e.message);
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
