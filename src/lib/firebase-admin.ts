
import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function initializeAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  try {
    // Этот способ должен работать в облачных средах Google по умолчанию.
    const app = admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return app;
  } catch (error: any) {
     // Если не сработало, пробуем ключ из переменной окружения.
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            const app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
            return app;
        } catch (e: any) {
            console.error("Firebase Admin SDK: Failed to initialize with service account key. Error:", e.message);
        }
    }
  }

  console.warn("Firebase Admin SDK: Could not be initialized. Default credentials not found, and FIREBASE_SERVICE_ACCOUNT_KEY is not set. Server-side auth will not work.");
  return null;
}

function getAdminApp(): admin.app.App | null {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}

export { getAdminApp };
