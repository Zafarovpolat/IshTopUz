'use server';

import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserId } from '@/lib/get-user-data';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

const db = getFirestore(getAdminApp());

type SavedType = 'project' | 'freelancer';

/**
 * Сохранённые элементы хранятся в users/{uid}/saved/{savedId}
 * где savedId = `${type}_${entityId}` для идемпотентности.
 */
export async function saveEntity(
  type: SavedType,
  entityId: string
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };
  if (!entityId) return { success: false, message: 'ID не указан.' };

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('saved')
      .doc(`${type}_${entityId}`)
      .set({
        type,
        entityId,
        createdAt: FieldValue.serverTimestamp(),
      });

    revalidatePath('/dashboard/offers');
    revalidatePath('/dashboard/talents');
    return { success: true, message: 'Сохранено.' };
  } catch (e: any) {
    logger.error('[saveEntity]', e);
    return { success: false, message: 'Не удалось сохранить.' };
  }
}

export async function unsaveEntity(
  type: SavedType,
  entityId: string
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('saved')
      .doc(`${type}_${entityId}`)
      .delete();

    revalidatePath('/dashboard/offers');
    return { success: true, message: 'Удалено из сохранённых.' };
  } catch (e: any) {
    logger.error('[unsaveEntity]', e);
    return { success: false, message: 'Не удалось удалить.' };
  }
}

export async function getSavedProjects(): Promise<string[]> {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    const snap = await db
      .collection('users')
      .doc(userId)
      .collection('saved')
      .where('type', '==', 'project')
      .get();
    return snap.docs.map((d) => d.data().entityId as string);
  } catch (e) {
    logger.error('[getSavedProjects]', e);
    return [];
  }
}

export async function getSavedFreelancers(): Promise<string[]> {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    const snap = await db
      .collection('users')
      .doc(userId)
      .collection('saved')
      .where('type', '==', 'freelancer')
      .get();
    return snap.docs.map((d) => d.data().entityId as string);
  } catch (e) {
    logger.error('[getSavedFreelancers]', e);
    return [];
  }
}
