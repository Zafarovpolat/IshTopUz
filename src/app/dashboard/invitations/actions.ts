'use server';

import { z } from 'zod';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserId } from '@/lib/get-user-data';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/lib/notifications';
import { logger } from '@/lib/logger';

const db = getFirestore(getAdminApp());

const sendInvitationSchema = z.object({
  freelancerId: z.string().min(1),
  projectId: z.string().min(1),
  message: z.string().min(10).max(1000),
});

export async function sendInvitation(
  data: z.infer<typeof sendInvitationSchema>
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  const parsed = sendInvitationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Проверка не удалась.' };
  }

  try {
    // Проверяем что вызывающий — клиент и владелец проекта.
    const projectDoc = await db.collection('projects').doc(parsed.data.projectId).get();
    if (!projectDoc.exists || projectDoc.data()?.clientId !== userId) {
      return { success: false, message: 'Нет прав на этот проект.' };
    }

    // Проверка что уже нет активного приглашения.
    const existing = await db
      .collection('invitations')
      .where('clientId', '==', userId)
      .where('freelancerId', '==', parsed.data.freelancerId)
      .where('projectId', '==', parsed.data.projectId)
      .limit(1)
      .get();
    if (!existing.empty) {
      return { success: false, message: 'Приглашение уже отправлено.' };
    }

    await db.collection('invitations').add({
      clientId: userId,
      freelancerId: parsed.data.freelancerId,
      projectId: parsed.data.projectId,
      message: parsed.data.message,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    await createNotification({
      recipientId: parsed.data.freelancerId,
      type: 'invitation',
      message: `Вас пригласили на проект "${projectDoc.data()?.title ?? ''}"`,
      entityId: parsed.data.projectId,
    });

    revalidatePath('/dashboard/offers');
    return { success: true, message: 'Приглашение отправлено.' };
  } catch (e: any) {
    logger.error('[sendInvitation]', e);
    return { success: false, message: 'Не удалось отправить приглашение.' };
  }
}

export async function respondInvitation(
  invitationId: string,
  accept: boolean
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  try {
    const ref = db.collection('invitations').doc(invitationId);
    const doc = await ref.get();
    if (!doc.exists) return { success: false, message: 'Приглашение не найдено.' };
    const inv = doc.data()!;
    if (inv.freelancerId !== userId) {
      return { success: false, message: 'Нет прав.' };
    }

    await ref.update({
      status: accept ? 'accepted' : 'declined',
      respondedAt: FieldValue.serverTimestamp(),
    });

    await createNotification({
      recipientId: inv.clientId,
      type: 'system',
      message: accept
        ? 'Ваше приглашение принято.'
        : 'Ваше приглашение отклонено.',
      entityId: inv.projectId,
    });

    revalidatePath('/dashboard/offers');
    return { success: true, message: accept ? 'Принято.' : 'Отклонено.' };
  } catch (e: any) {
    logger.error('[respondInvitation]', e);
    return { success: false, message: 'Не удалось обработать приглашение.' };
  }
}

export async function getInvitationsForFreelancer() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const snap = await db
      .collection('invitations')
      .where('freelancerId', '==', userId)
      .where('status', '==', 'pending')
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        clientId: data.clientId,
        projectId: data.projectId,
        message: data.message,
        status: data.status,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      };
    });
  } catch (e) {
    logger.error('[getInvitationsForFreelancer]', e);
    return [];
  }
}

export async function getInvitationsSentByClient() {
  const userId = await getUserId();
  if (!userId) return [];
  try {
    const snap = await db
      .collection('invitations')
      .where('clientId', '==', userId)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    logger.error('[getInvitationsSentByClient]', e);
    return [];
  }
}
