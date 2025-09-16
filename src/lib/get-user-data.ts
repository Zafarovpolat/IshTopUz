import 'server-only';
import { headers } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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
  
  const db = getFirestore(adminApp);
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data();
}