import 'server-only';
import { headers } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';

export async function getUserId() {
  const headersList = headers();
  return headersList.get('x-user-id');
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
  
  // Конвертируем все Timestamp объекты в обычные Date объекты
  const serializedUserData = JSON.parse(JSON.stringify(userData, (key, value) => {
    // Если значение имеет _seconds и _nanoseconds (Firestore Timestamp)
    if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
      // Конвертируем в ISO string для сериализации
      return new Date(value._seconds * 1000 + value._nanoseconds / 1000000).toISOString();
    }
    // Если это обычный Timestamp объект Firestore
    if (value && typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }
    return value;
  }));

  return serializedUserData;
}