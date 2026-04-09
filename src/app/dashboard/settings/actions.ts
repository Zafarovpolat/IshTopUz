'use server';

import { z } from 'zod';
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getUserId } from '@/lib/get-user-data';
import { revalidatePath } from 'next/cache';
import {
  changePasswordSchema,
  notificationSettingsSchema,
  privacySettingsSchema,
  type SettingsState,
} from '@/lib/schema';
import { logger } from '@/lib/logger';

const adminApp = getAdminApp();
const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

/**
 * Смена пароля. Текущий пароль проверяется через Firebase REST API
 * (verifyPassword), т.к. Admin SDK не умеет валидировать пароль.
 */
export async function updatePassword(
  data: z.infer<typeof changePasswordSchema>
): Promise<SettingsState> {
  const userId = await getUserId();
  if (!userId) {
    return { success: false, message: 'Необходима авторизация.' };
  }

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
    };
  }

  try {
    const userRecord = await auth.getUser(userId);
    const email = userRecord.email;

    if (!email) {
      return { success: false, message: 'У аккаунта не установлен email.' };
    }

    const hasPasswordProvider = userRecord.providerData.some(
      (p) => p.providerId === 'password'
    );

    // Если пароль уже был установлен — проверяем текущий через REST API.
    if (hasPasswordProvider) {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        logger.error('[updatePassword] NEXT_PUBLIC_FIREBASE_API_KEY is not set');
        return { success: false, message: 'Ошибка конфигурации сервера.' };
      }

      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: parsed.data.currentPassword,
            returnSecureToken: false,
          }),
        }
      );

      if (!res.ok) {
        return {
          success: false,
          errors: { currentPassword: ['Неверный текущий пароль.'] },
          message: 'Неверный текущий пароль.',
        };
      }
    }

    await auth.updateUser(userId, { password: parsed.data.newPassword });
    await db.collection('users').doc(userId).update({
      passwordSet: true,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Инвалидируем все сессии для безопасности.
    await auth.revokeRefreshTokens(userId);

    revalidatePath('/dashboard/settings');
    return { success: true, message: 'Пароль успешно изменён.' };
  } catch (e: unknown) {
    logger.error('[updatePassword] failed:', e);
    const msg = e instanceof Error ? e.message : 'Не удалось изменить пароль.';
    return { success: false, message: msg };
  }
}

export async function updateNotificationSettings(
  data: z.infer<typeof notificationSettingsSchema>
): Promise<SettingsState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  const parsed = notificationSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
    };
  }

  try {
    await db
      .collection('users')
      .doc(userId)
      .update({
        'settings.notifications': parsed.data,
        updatedAt: FieldValue.serverTimestamp(),
      });

    revalidatePath('/dashboard/settings');
    return { success: true, message: 'Настройки уведомлений сохранены.' };
  } catch (e) {
    logger.error('[updateNotificationSettings] failed:', e);
    return { success: false, message: 'Не удалось сохранить настройки.' };
  }
}

export async function updatePrivacySettings(
  data: z.infer<typeof privacySettingsSchema>
): Promise<SettingsState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: 'Необходима авторизация.' };

  const parsed = privacySettingsSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
    };
  }

  try {
    await db
      .collection('users')
      .doc(userId)
      .update({
        'settings.privacy': parsed.data,
        updatedAt: FieldValue.serverTimestamp(),
      });

    revalidatePath('/dashboard/settings');
    return { success: true, message: 'Настройки приватности сохранены.' };
  } catch (e) {
    logger.error('[updatePrivacySettings] failed:', e);
    return { success: false, message: 'Не удалось сохранить настройки.' };
  }
}

export async function getUserSettings(): Promise<{
  notifications: z.infer<typeof notificationSettingsSchema>;
  privacy: z.infer<typeof privacySettingsSchema>;
}> {
  const userId = await getUserId();
  const defaults = {
    notifications: {
      emailNews: true,
      emailMessages: true,
      telegramInvites: false,
      telegramMessages: false,
    },
    privacy: { profileVisibility: 'visible' as const },
  };

  if (!userId) return defaults;

  try {
    const doc = await db.collection('users').doc(userId).get();
    const settings = doc.data()?.settings ?? {};
    return {
      notifications: { ...defaults.notifications, ...(settings.notifications ?? {}) },
      privacy: { ...defaults.privacy, ...(settings.privacy ?? {}) },
    };
  } catch (e) {
    logger.error('[getUserSettings] failed:', e);
    return defaults;
  }
}
