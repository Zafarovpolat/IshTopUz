
import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function getAdminApp(): admin.app.App | null {
  if (adminApp) {
    return adminApp;
  }

  // Если приложение уже инициализировано, используем его
  if (admin.apps.length > 0) {
    adminApp = admin.apps[0];
    return adminApp;
  }

  try {
    // В средах Google Cloud (включая Firebase Studio)
    // SDK автоматически найдет учетные данные, но projectId лучше указать явно.
    adminApp = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return adminApp;
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // Попытка запасного варианта с сервисным ключом, если он есть
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            adminApp = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            return adminApp;
        } catch (e) {
            console.error("Failed to initialize Firebase Admin SDK with service account key:", e);
        }
    }
  }
  
  console.warn("Firebase Admin SDK could not be initialized. Some server-side functionality may not work.");
  return null;
}

// Экспортируем функцию для получения инстанса
export { getAdminApp };
