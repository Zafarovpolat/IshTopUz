
import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

function getAdminApp(): admin.app.App | null {
  if (adminApp) {
    return adminApp;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (admin.apps.length > 0) {
    adminApp = admin.apps[0];
    return adminApp;
  }

  if (!serviceAccountKey) {
    console.warn("Firebase service account key is not available. Firebase Admin SDK will not be initialized.");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return adminApp;
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    return null;
  }
}

// Экспортируем функцию для получения инстанса
export { getAdminApp };
