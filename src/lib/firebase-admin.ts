
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

let adminApp: admin.app.App;

if (!admin.apps.length) {
  if (!serviceAccount) {
    throw new Error('Firebase service account key is not available. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable.');
  }
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  adminApp = admin.apps[0]!;
}

export { adminApp };
