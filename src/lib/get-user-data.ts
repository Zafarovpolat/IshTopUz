import 'server-only';
import { cookies } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function getUserId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error: any) {
    // ✅ Логируем только если это не "revoked" (ожидаемая ошибка после установки пароля)
    if (error.code !== 'auth/session-cookie-revoked') {
      console.error('getUserId: Invalid session cookie:', error);
    }
    return null;
  }
}

export async function getUserData() {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }

  const adminApp = getAdminApp();
  if (!adminApp) {
    console.error("getUserData: Firebase Admin SDK not initialized.");
    return null;
  }

  const db = adminApp.firestore();
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return null;
  }

  const userData = userDoc.data();

  const serializedUserData = JSON.parse(JSON.stringify(userData, (key, value) => {
    if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
      return new Date(value._seconds * 1000 + value._nanoseconds / 1000000).toISOString();
    }
    if (value && typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }
    return value;
  }));

  return serializedUserData;
}