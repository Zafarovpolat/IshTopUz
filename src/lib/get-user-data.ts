
import 'server-only';
import { headers } from 'next/headers';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, doc, getDoc } from 'firebase-admin/firestore';

export async function getUserId() {
  const headersList = headers();
  return headersList.get('x-user-id');
}

export async function getUserData() {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }

  // Ensure admin app is initialized before using any admin services
  getAdminApp();
  
  const db = getFirestore();
  const userRef = doc(db, 'users', userId);
  
  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data();
  } catch (error) {
    console.error("Error fetching user data in getUserData:", error);
    return null;
  }
}
