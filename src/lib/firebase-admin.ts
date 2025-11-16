import admin from 'firebase-admin';

declare global {
  // eslint-disable-next-line no-var
  var __firebaseAdminApp__: admin.app.App | undefined;
}

function initializeAdminApp(): admin.app.App {
  if (global.__firebaseAdminApp__) {
    return global.__firebaseAdminApp__;
  }

  if (admin.apps.length > 0 && admin.apps[0]) {
    global.__firebaseAdminApp__ = admin.apps[0];
    return admin.apps[0];
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountString) {
    console.error("Firebase Admin SDK: FIREBASE_SERVICE_ACCOUNT environment variable not set");
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set.");
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);

    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    global.__firebaseAdminApp__ = app;
    console.log('✅ Firebase Admin SDK initialized successfully');

    return app;
  } catch (e: any) {
    console.error("Firebase Admin SDK: Failed to parse FIREBASE_SERVICE_ACCOUNT:", e.message);
    throw new Error("Failed to initialize Firebase Admin SDK due to parsing error.");
  }
}

export function getAdminApp(): admin.app.App {
  return initializeAdminApp();
}