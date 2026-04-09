'use server';

import { z } from 'zod';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getUserId } from '@/lib/get-user-data';
import { revalidatePath } from 'next/cache';
import { reviewSchema, type Review, type ReviewState } from '@/lib/schema';
import { createNotification } from '@/lib/notifications';
import { logger } from '@/lib/logger';

const db = getFirestore(getAdminApp());

/**
 * Оставить отзыв на участника завершённого проекта.
 * Отзыв хранится в projects/{projectId}/reviews/{reviewId},
 * агрегированный рейтинг — в users/{targetUserId}.
 */
export async function submitReview(
  data: z.infer<typeof reviewSchema>
): Promise<ReviewState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
    };
  }

  if (parsed.data.targetUserId === userId) {
    return { success: false, message: 'Нельзя оставить отзыв самому себе.' };
  }

  try {
    const projectRef = db.collection('projects').doc(parsed.data.projectId);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      return { success: false, message: 'Проект не найден.' };
    }
    const project = projectDoc.data()!;

    // Только участники завершённого проекта могут оставить отзыв.
    const isClient = project.clientId === userId;
    const isFreelancer = project.freelancerId === userId;
    if (!isClient && !isFreelancer) {
      return { success: false, message: 'Вы не участвуете в этом проекте.' };
    }
    if (project.status !== 'completed') {
      return { success: false, message: 'Отзыв можно оставить после завершения проекта.' };
    }

    // Проверка что отзыв ещё не оставлен.
    const existing = await projectRef
      .collection('reviews')
      .where('authorId', '==', userId)
      .where('targetUserId', '==', parsed.data.targetUserId)
      .limit(1)
      .get();
    if (!existing.empty) {
      return { success: false, message: 'Вы уже оставили отзыв.' };
    }

    // Пишем отзыв + обновляем агрегированный рейтинг атомарно.
    await db.runTransaction(async (tx) => {
      const targetRef = db.collection('users').doc(parsed.data.targetUserId);
      const targetDoc = await tx.get(targetRef);
      if (!targetDoc.exists) throw new Error('Пользователь не найден.');
      const target = targetDoc.data()!;
      const profileKey =
        target.userType === 'freelancer' ? 'freelancerProfile' : 'clientProfile';

      const prevRating = target[profileKey]?.rating ?? 0;
      const prevCount = target[profileKey]?.reviewsCount ?? 0;
      const newCount = prevCount + 1;
      const newRating = (prevRating * prevCount + parsed.data.rating) / newCount;

      const reviewRef = projectRef.collection('reviews').doc();
      tx.set(reviewRef, {
        authorId: userId,
        targetUserId: parsed.data.targetUserId,
        projectId: parsed.data.projectId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        createdAt: FieldValue.serverTimestamp(),
      });

      tx.update(targetRef, {
        [`${profileKey}.rating`]: Math.round(newRating * 100) / 100,
        [`${profileKey}.reviewsCount`]: newCount,
      });
    });

    await createNotification({
      recipientId: parsed.data.targetUserId,
      type: 'review_received',
      message: `Вы получили новый отзыв (${parsed.data.rating}★).`,
      entityId: parsed.data.projectId,
    });

    revalidatePath(`/dashboard/projects`);
    return { success: true, message: 'Отзыв отправлен!' };
  } catch (e: any) {
    logger.error('[submitReview]', e);
    return { success: false, message: e.message || 'Не удалось отправить отзыв.' };
  }
}

export async function getReviewsForUser(targetUserId: string): Promise<Review[]> {
  try {
    const snap = await db
      .collectionGroup('reviews')
      .where('targetUserId', '==', targetUserId)
      .get();

    const reviews = await Promise.all(
      snap.docs.map(async (doc) => {
        const d = doc.data();
        const authorDoc = await db.collection('users').doc(d.authorId).get();
        const author = authorDoc.data();
        return {
          id: doc.id,
          projectId: d.projectId,
          authorId: d.authorId,
          targetUserId: d.targetUserId,
          rating: d.rating,
          comment: d.comment,
          createdAt: d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
          author: author
            ? {
                name: `${author.profile?.firstName ?? ''} ${author.profile?.lastName ?? ''}`.trim(),
                avatar: author.profile?.avatar ?? '',
              }
            : undefined,
        } as Review;
      })
    );

    reviews.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return reviews;
  } catch (e) {
    logger.error('[getReviewsForUser]', e);
    return [];
  }
}
