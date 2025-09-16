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
  
  const db = adminApp.firestore(); // Используем метод firestore() из adminApp
  const userDoc = await db.collection('users').doc(userId).get();

  if (!userDoc.exists) {
    return null;
  }

  return userDoc.data();
}