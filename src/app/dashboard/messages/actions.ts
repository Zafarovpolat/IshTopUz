'use server';

import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserId } from '@/lib/get-user-data';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sendMessageSchema } from '@/lib/schema';
import { logger } from '@/lib/logger';

const db = getFirestore(getAdminApp());

/**
 * Найти или создать conversation между двумя участниками.
 * Возвращает conversationId.
 */
export async function getOrCreateConversation(
  otherUserId: string,
  projectId?: string
): Promise<{ success: boolean; conversationId?: string; message?: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };
  if (otherUserId === userId) {
    return { success: false, message: 'Нельзя создать чат с самим собой.' };
  }

  try {
    // Ищем существующую.
    const existing = await db
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();

    for (const doc of existing.docs) {
      const parts: string[] = doc.data().participants ?? [];
      if (parts.includes(otherUserId) && parts.length === 2) {
        return { success: true, conversationId: doc.id };
      }
    }

    // Создаём новую. Подтягиваем participantInfo.
    const [meDoc, otherDoc] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('users').doc(otherUserId).get(),
    ]);
    if (!otherDoc.exists) {
      return { success: false, message: 'Пользователь не найден.' };
    }
    const me = meDoc.data();
    const other = otherDoc.data();

    const docRef = await db.collection('conversations').add({
      participants: [userId, otherUserId],
      participantsInfo: {
        [userId]: {
          name: `${me?.profile?.firstName ?? ''} ${me?.profile?.lastName ?? ''}`.trim() || 'Пользователь',
          avatar: me?.profile?.avatar ?? '',
        },
        [otherUserId]: {
          name: `${other?.profile?.firstName ?? ''} ${other?.profile?.lastName ?? ''}`.trim() || 'Пользователь',
          avatar: other?.profile?.avatar ?? '',
        },
      },
      projectId: projectId ?? null,
      lastMessage: '',
      lastMessageAt: FieldValue.serverTimestamp(),
      unreadCount: { [userId]: 0, [otherUserId]: 0 },
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/messages');
    return { success: true, conversationId: docRef.id };
  } catch (e: any) {
    logger.error('[getOrCreateConversation]', e);
    return { success: false, message: 'Не удалось открыть чат.' };
  }
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<{ success: boolean; message?: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  const parsed = sendMessageSchema.safeParse({ text });
  if (!parsed.success) return { success: false, message: 'Пустое сообщение.' };

  const rl = rateLimit(`msg:${userId}`, RATE_LIMITS.sendMessage);
  if (!rl.success) return { success: false, message: 'Слишком часто, подождите.' };

  try {
    const convRef = db.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    if (!convDoc.exists) return { success: false, message: 'Чат не найден.' };

    const participants: string[] = convDoc.data()?.participants ?? [];
    if (!participants.includes(userId)) {
      return { success: false, message: 'Нет доступа.' };
    }

    const otherId = participants.find((p) => p !== userId);

    const batch = db.batch();
    const msgRef = convRef.collection('messages').doc();
    batch.set(msgRef, {
      senderId: userId,
      text: parsed.data.text,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    const updates: Record<string, unknown> = {
      lastMessage: parsed.data.text.slice(0, 200),
      lastMessageAt: FieldValue.serverTimestamp(),
      lastSenderId: userId,
    };
    if (otherId) {
      updates[`unreadCount.${otherId}`] = FieldValue.increment(1);
    }
    batch.update(convRef, updates);

    await batch.commit();

    if (otherId) {
      await createNotification({
        recipientId: otherId,
        type: 'new_message',
        message: `Новое сообщение: ${parsed.data.text.slice(0, 60)}`,
        entityId: conversationId,
        link: `/dashboard/messages?id=${conversationId}`,
      });
    }

    return { success: true };
  } catch (e: any) {
    logger.error('[sendMessage]', e);
    return { success: false, message: 'Не удалось отправить.' };
  }
}

export async function markConversationRead(
  conversationId: string
): Promise<{ success: boolean }> {
  const userId = await getUserId();
  if (!userId) return { success: false };

  try {
    await db
      .collection('conversations')
      .doc(conversationId)
      .update({ [`unreadCount.${userId}`]: 0 });
    return { success: true };
  } catch (e) {
    logger.error('[markConversationRead]', e);
    return { success: false };
  }
}
