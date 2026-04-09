import 'server-only';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { logger } from '@/lib/logger';

const db = getFirestore(getAdminApp());

export type NotificationType =
  | 'proposal_received'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'project_completed'
  | 'new_message'
  | 'invitation'
  | 'review_received'
  | 'system';

export interface CreateNotificationInput {
  recipientId: string;
  type: NotificationType;
  message: string;
  entityId?: string;
  link?: string;
}

/**
 * Создать уведомление (top-level коллекция /notifications).
 * Клиентский SDK в notification-bell.tsx подхватит через onSnapshot.
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<void> {
  try {
    await db.collection('notifications').add({
      recipientId: input.recipientId,
      type: input.type,
      message: input.message,
      entityId: input.entityId ?? null,
      link: input.link ?? null,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    logger.error('[createNotification] failed:', e);
  }
}

/**
 * Пометить все уведомления пользователя прочитанными.
 * Вызывается из Server Action, поэтому через Admin SDK (обходит правила).
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  try {
    const snap = await db
      .collection('notifications')
      .where('recipientId', '==', userId)
      .where('isRead', '==', false)
      .get();

    if (snap.empty) return;

    const batch = db.batch();
    snap.docs.forEach((d) => batch.update(d.ref, { isRead: true }));
    await batch.commit();
  } catch (e) {
    logger.error('[markAllNotificationsRead] failed:', e);
  }
}
