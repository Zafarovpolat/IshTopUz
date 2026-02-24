"use server";

import { z } from "zod";
import {
  leadSchema,
  surveyClientSchema,
  surveyFreelancerSchema,
  profileFreelancerSchema,
  profileClientSchema,
  onboardingSchema,
  portfolioItemSchema,
  projectSchema,
  proposalSchema,
  setPasswordSchema, // ✅ ДОБАВЬ
  type Project
} from "@/lib/schema";
import type {
  LeadState,
  SurveyState,
  ProfileState,
  OnboardingState,
  PortfolioState,
  ProjectState,
  ProposalState,
  SetPasswordState // ✅ ДОБАВЬ
} from "@/lib/schema";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore, FieldValue, DocumentReference } from "firebase-admin/firestore";
import { getAuth } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';
import { getUserId } from '@/lib/get-user-data'; // ✅ ДОБАВЬ

// Инициализируем Admin SDK
const adminApp = getAdminApp();
const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

export async function submitLead(
  data: z.infer<typeof leadSchema>
): Promise<LeadState> {
  const validatedFields = leadSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.',
      success: false,
    };
  }

  try {
    const docRef = await db.collection('leads').add({
      ...validatedFields.data,
    });
    return {
      success: true,
      message: 'Форма успешно отправлена! Перенаправляем...',
      redirectUrl: `/survey?role=${validatedFields.data.role}&leadId=${docRef.id}&name=${encodeURIComponent(validatedFields.data.name)}&email=${encodeURIComponent(validatedFields.data.email)}`,
    };
  } catch (e) {
    console.error('Failed to submit lead:', e);
    return {
      success: false,
      message: 'Что-то пошло не так на нашей стороне. Пожалуйста, повторите попытку позже.',
    };
  }
}

export async function submitSurvey(
  data: z.infer<typeof surveyFreelancerSchema> | z.infer<typeof surveyClientSchema>,
  role: 'Freelancer' | 'Client'
): Promise<SurveyState> {
  if (!['Freelancer', 'Client'].includes(role)) {
    return { success: false, message: 'Неверная роль' };
  }

  const schema = role === 'Freelancer' ? surveyFreelancerSchema : surveyClientSchema;
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.',
      success: false,
    };
  }

  try {
    await db.collection('surveys').add({
      role,
      ...validatedFields.data,
    });
    return { success: true, message: 'Спасибо за ваш отзыв!' };
  } catch (error: any) {
    console.error('Firestore error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    return {
      success: false,
      message: `Ошибка при отправке данных: ${error.message || 'Неизвестная ошибка'}`,
    };
  }
}

export async function createUserOnboarding(
  userId: string,
  data: z.infer<typeof onboardingSchema>
): Promise<OnboardingState> {
  if (!userId) {
    return { success: false, message: 'Ошибка: Пользователь не найден.' };
  }

  const validatedFields = onboardingSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }

  const { firstName, lastName, userType, email } = validatedFields.data;

  try {
    // ========================================
    // ШАГ 1: Получаем данные пользователя из Firebase Auth
    // ========================================
    let userRecord;
    try {
      userRecord = await auth.getUser(userId);
      console.log('👤 [Onboarding] Got user record:', {
        uid: userRecord.uid,
        email: userRecord.email,
        providers: userRecord.providerData.map(p => p.providerId)
      });
    } catch (error) {
      console.error('❌ [Onboarding] getUser failed:', error);
      return {
        success: false,
        message: 'Ошибка аутентификации. Попробуйте войти снова.'
      };
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // ========================================
    // ШАГ 2: СУЩЕСТВУЮЩИЙ ДОКУМЕНТ
    // ========================================
    if (userDoc.exists) {
      const existingData = userDoc.data();

      console.log('📄 [Onboarding] Existing user data:', {
        profileComplete: existingData?.profileComplete,
        passwordSet: existingData?.passwordSet,
        email: existingData?.email,
        userType: existingData?.userType,
      });

      // Проверка: если профиль уже заполнен И пароль установлен
      if (existingData?.profileComplete && existingData?.passwordSet === true) {
        console.log('✅ [Onboarding] Profile already complete with password');
        return {
          success: true,
          message: "Профиль уже заполнен.",
          redirectUrl: '/dashboard',
        };
      }

      // Подготовка данных для обновления
      const updateData: any = {
        userType,
        profileComplete: true,
        lastLoginAt: FieldValue.serverTimestamp(),
        'profile.firstName': firstName,
        'profile.lastName': lastName,
      };

      // ✅ ВАЖНО: Явно устанавливаем passwordSet в false если его нет
      if (existingData.passwordSet === undefined) {
        updateData.passwordSet = false;
        console.log('🔐 [Onboarding] Initializing passwordSet to false');
      }

      // ========================================
      // ШАГ 3: Email обработка
      // ========================================
      let finalEmail = '';
      let emailWasUpdated = false; // ✅ Флаг обновления email

      if (email && email.trim() !== '') {
        finalEmail = email.trim();
        updateData.email = finalEmail;

        console.log(`📧 [Onboarding] Processing email: ${finalEmail}`);

        try {
          // Проверяем существует ли пользователь с таким email
          try {
            const existingUserWithEmail = await auth.getUserByEmail(finalEmail);

            if (existingUserWithEmail.uid !== userId) {
              console.warn(`⚠️ [Onboarding] Email conflict: ${finalEmail} belongs to ${existingUserWithEmail.uid}`);

              // Удаляем конфликтующего пользователя
              try {
                await auth.deleteUser(existingUserWithEmail.uid);
                console.log(`🗑️ [Onboarding] Deleted conflicting Auth user ${existingUserWithEmail.uid}`);

                // Удаляем из Firestore
                try {
                  await db.collection('users').doc(existingUserWithEmail.uid).delete();
                  console.log(`🗑️ [Onboarding] Deleted conflicting Firestore document`);
                } catch (firestoreError) {
                  console.log('ℹ️ [Onboarding] No Firestore document to delete');
                }
              } catch (deleteError: any) {
                console.error(`❌ [Onboarding] Failed to delete conflicting user:`, deleteError);
                return {
                  success: false,
                  message: `Email ${finalEmail} уже используется другим пользователем.`
                };
              }
            } else {
              console.log(`✅ [Onboarding] Email ${finalEmail} already belongs to current user`);
            }
          } catch (emailCheckError: any) {
            if (emailCheckError.code === 'auth/user-not-found') {
              console.log(`✅ [Onboarding] Email ${finalEmail} is available`);
            } else {
              throw emailCheckError;
            }
          }

          // ✅ Устанавливаем email в Firebase Auth
          await auth.updateUser(userId, {
            email: finalEmail,
            emailVerified: false,
          });

          emailWasUpdated = true; // ✅ Email был обновлен
          console.log(`✅ [Onboarding] Email ${finalEmail} set in Firebase Auth`);

        } catch (emailError: any) {
          console.error('❌ [Onboarding] Failed to update email in Firebase Auth:', emailError);

          if (emailError.code === 'auth/email-already-exists') {
            return {
              success: false,
              message: `Email ${finalEmail} уже используется. Попробуйте другой.`
            };
          }

          console.warn('⚠️ [Onboarding] Continuing despite email error...');
        }
      } else if (userRecord.email && userRecord.email.trim() !== '') {
        finalEmail = userRecord.email;
        updateData.email = finalEmail;
        console.log(`📧 [Onboarding] Using email from Auth: ${finalEmail}`);
      } else {
        console.warn('⚠️ [Onboarding] No email provided');
      }

      // ========================================
      // ШАГ 4: Дополнительные данные
      // ========================================
      if (userRecord.phoneNumber && userRecord.phoneNumber.trim() !== '') {
        updateData.phone = userRecord.phoneNumber;
      }

      if (userRecord.photoURL && userRecord.photoURL.trim() !== '') {
        updateData['profile.avatar'] = userRecord.photoURL;
      }

      // ========================================
      // ШАГ 5: Добавляем профиль в зависимости от типа
      // ========================================
      if (userType === 'freelancer' && !existingData?.freelancerProfile) {
        updateData.freelancerProfile = {
          title: '',
          description: '',
          hourlyRate: 0,
          skills: [],
          categories: [],
          experience: 'beginner',
          completedProjects: 0,
          rating: 0,
          reviewsCount: 0,
          isAvailable: true,
          lastActiveAt: FieldValue.serverTimestamp(),
        };
        console.log('👨‍💻 [Onboarding] Adding freelancer profile');
      }

      if (userType === 'client' && !existingData?.clientProfile) {
        updateData.clientProfile = {
          companyName: '',
          companySize: '1',
          industry: '',
          website: '',
          description: '',
          projectsPosted: 0,
          moneySpent: 0,
          rating: 0,
          reviewsCount: 0,
        };
        console.log('👔 [Onboarding] Adding client profile');
      }

      console.log('💾 [Onboarding] Updating Firestore with fields:', Object.keys(updateData));

      // ========================================
      // ШАГ 6: Сохраняем в Firestore
      // ========================================
      await userRef.update(updateData);

      console.log('✅ [Onboarding] Firestore updated successfully');

      // ========================================
      // ШАГ 7: ✅ ВАЖНО! Создаем новый custom token если email был обновлен
      // ========================================
      if (emailWasUpdated) {
        try {
          console.log('🔑 [Onboarding] Email was updated, creating new custom token...');
          const newCustomToken = await auth.createCustomToken(userId);
          console.log('✅ [Onboarding] New custom token created');

          // ✅ Проверяем нужен ли пароль
          let needsPassword = false;
          try {
            const updatedAuthUser = await auth.getUser(userId);
            const hasPasswordProvider = updatedAuthUser.providerData.some(
              p => p.providerId === 'password'
            );
            needsPassword = !hasPasswordProvider;
            console.log(`🔐 [Onboarding] needsPassword: ${needsPassword}`);
          } catch (error) {
            console.error('⚠️ [Onboarding] Could not check providers:', error);
            needsPassword = true;
          }

          const redirectUrl = needsPassword ? '/set-password' : '/dashboard';
          console.log(`🚀 [Onboarding] Returning new token, redirecting to: ${redirectUrl}`);

          // ✅ Возвращаем новый токен клиенту
          return {
            success: true,
            message: "Профиль успешно обновлен.",
            redirectUrl: redirectUrl,
            newToken: newCustomToken, // ✅ Новый токен для переавторизации
          };
        } catch (tokenError) {
          console.error('❌ [Onboarding] Failed to create new token:', tokenError);
          // Не критично, продолжаем без нового токена
        }
      }

      // ========================================
      // ШАГ 8: Проверка необходимости установки пароля (если email НЕ был обновлен)
      // ========================================
      let needsPassword = false;

      try {
        const updatedAuthUser = await auth.getUser(userId);

        console.log(`🔍 [Onboarding] Checking password provider:`, {
          email: updatedAuthUser.email,
          providers: updatedAuthUser.providerData.map(p => p.providerId),
        });

        const hasPasswordProvider = updatedAuthUser.providerData.some(
          p => p.providerId === 'password'
        );

        needsPassword = !hasPasswordProvider;

        console.log(`🔐 [Onboarding] hasPasswordProvider: ${hasPasswordProvider}, needsPassword: ${needsPassword}`);

      } catch (error) {
        console.error('⚠️ [Onboarding] Could not check providers:', error);
        needsPassword = true;
      }

      const redirectUrl = needsPassword ? '/set-password' : '/dashboard';
      console.log(`🚀 [Onboarding] Complete! Redirecting to: ${redirectUrl}`);

      return {
        success: true,
        message: "Профиль успешно обновлен.",
        redirectUrl: redirectUrl,
      };
    }

    // ========================================
    // ШАГ 9: НОВЫЙ ДОКУМЕНТ (маловероятно для Telegram)
    // ========================================
    console.log('📝 [Onboarding] Creating new Firestore document for:', userId);

    let finalEmail = '';
    let emailWasSet = false;

    if (email && email.trim() !== '') {
      finalEmail = email.trim();

      try {
        // Проверяем конфликты
        try {
          const existingUserWithEmail = await auth.getUserByEmail(finalEmail);
          if (existingUserWithEmail.uid !== userId) {
            console.warn(`⚠️ [Onboarding] Deleting conflicting user ${existingUserWithEmail.uid}`);
            await auth.deleteUser(existingUserWithEmail.uid);
            try {
              await db.collection('users').doc(existingUserWithEmail.uid).delete();
            } catch (e) {
              console.log('ℹ️ [Onboarding] No Firestore doc to delete');
            }
          }
        } catch (e: any) {
          if (e.code !== 'auth/user-not-found') throw e;
        }

        // Устанавливаем email
        await auth.updateUser(userId, {
          email: finalEmail,
          emailVerified: false,
        });

        emailWasSet = true;
        console.log(`✅ [Onboarding] Email ${finalEmail} set for new user`);
      } catch (emailError: any) {
        console.error('❌ [Onboarding] Failed to set email:', emailError);
        if (emailError.code === 'auth/email-already-exists') {
          return {
            success: false,
            message: `Email ${finalEmail} уже используется.`
          };
        }
      }
    } else if (userRecord.email) {
      finalEmail = userRecord.email;
    }

    const userData: any = {
      email: finalEmail,
      phone: userRecord.phoneNumber || '',
      userType,
      isVerified: userRecord.emailVerified || false,
      createdAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp(),
      profile: {
        firstName,
        lastName,
        avatar: userRecord.photoURL || '',
        city: '',
        country: '',
        dateOfBirth: '',
        gender: '',
        languages: [],
        timezone: '',
      },
      wallet: {
        balance: 0,
        currency: 'UZS',
        paymentMethods: [],
        transactions: [],
      },
      profileComplete: true,
      passwordSet: false, // ✅ ВАЖНО: Изначально пароль не установлен
    };

    if (userType === 'freelancer') {
      userData.freelancerProfile = {
        title: '',
        description: '',
        hourlyRate: 0,
        skills: [],
        categories: [],
        experience: 'beginner',
        completedProjects: 0,
        rating: 0,
        reviewsCount: 0,
        isAvailable: true,
        lastActiveAt: FieldValue.serverTimestamp(),
      };
    }

    if (userType === 'client') {
      userData.clientProfile = {
        companyName: '',
        companySize: '1',
        industry: '',
        website: '',
        description: '',
        projectsPosted: 0,
        moneySpent: 0,
        rating: 0,
        reviewsCount: 0,
      };
    }

    await userRef.set(userData);

    console.log('✅ [Onboarding] New user document created');

    // ✅ Если email был установлен - создаем новый токен
    if (emailWasSet) {
      try {
        console.log('🔑 [Onboarding] Creating new custom token for new user...');
        const newCustomToken = await auth.createCustomToken(userId);
        console.log('✅ [Onboarding] New custom token created');

        return {
          success: true,
          message: "Профиль успешно создан.",
          redirectUrl: '/set-password',
          newToken: newCustomToken,
        };
      } catch (tokenError) {
        console.error('❌ [Onboarding] Failed to create new token:', tokenError);
      }
    }

    console.log(`🚀 [Onboarding] New user setup complete, redirecting to /set-password`);

    return {
      success: true,
      message: "Профиль успешно создан.",
      redirectUrl: '/set-password',
    };

  } catch (error: any) {
    console.error("❌ [Onboarding] Failed:", error);
    return {
      success: false,
      message: error.message || 'Не удалось сохранить данные.'
    };
  }
}

export async function updateProfile(
  userId: string,
  userType: 'freelancer' | 'client',
  data: z.infer<typeof profileFreelancerSchema> | z.infer<typeof profileClientSchema> | { avatar: string }
): Promise<ProfileState> {
  // ✅ SECURITY: Проверяем что текущий пользователь = владелец профиля
  const currentUserId = await getUserId();

  if (!currentUserId) {
    console.error('❌ [updateProfile] No authenticated user');
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  if (currentUserId !== userId) {
    console.error(`❌ [updateProfile] Permission denied: ${currentUserId} tried to update profile of ${userId}`);
    return { success: false, message: 'Ошибка: У вас нет прав на редактирование этого профиля.' };
  }

  console.log(`✏️ [updateProfile] User ${currentUserId} updating profile`);

  const userRef = db.collection('users').doc(userId);

  // Special case for only updating the avatar
  if ('avatar' in data && Object.keys(data).length === 1) {
    try {
      console.log(`🖼️ [updateProfile] Updating avatar for user ${userId}`);
      await userRef.update({ 'profile.avatar': data.avatar });
      revalidatePath('/dashboard/profile');
      return { success: true, message: 'Аватар успешно обновлен!' };
    } catch (e) {
      console.error('❌ [updateProfile] Failed to update avatar:', e);
      return { success: false, message: 'Не удалось обновить аватар.' };
    }
  }

  const schema = userType === 'freelancer' ? profileFreelancerSchema : profileClientSchema;
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    console.log('❌ [updateProfile] Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки и попробуйте снова.',
      success: false,
    };
  }

  try {
    const updateData: { [key: string]: any } = {
      'updatedAt': FieldValue.serverTimestamp(),
    };

    if (userType === 'freelancer') {
      const { firstName, lastName, city, country, dateOfBirth, gender, languages, ...freelancerProfileData } = validatedFields.data as z.infer<typeof profileFreelancerSchema>;

      const skillsArray = Array.isArray(freelancerProfileData.skills)
        ? freelancerProfileData.skills
        : (freelancerProfileData.skills || '').split(',').map(s => s.trim()).filter(Boolean);

      const languagesArray = Array.isArray(languages)
        ? languages
        : (languages || '').split(',').map(l => l.trim()).filter(Boolean);

      updateData['profile.firstName'] = firstName;
      updateData['profile.lastName'] = lastName;
      updateData['profile.city'] = city;
      updateData['profile.country'] = country;
      updateData['profile.dateOfBirth'] = dateOfBirth;
      updateData['profile.gender'] = gender;
      updateData['profile.languages'] = languagesArray;
      updateData['freelancerProfile.title'] = freelancerProfileData.title;
      updateData['freelancerProfile.hourlyRate'] = freelancerProfileData.hourlyRate;
      updateData['freelancerProfile.experience'] = freelancerProfileData.experience;
      updateData['freelancerProfile.isAvailable'] = freelancerProfileData.isAvailable;
      updateData['freelancerProfile.description'] = freelancerProfileData.description;
      updateData['freelancerProfile.skills'] = skillsArray;

      console.log(`👨‍💻 [updateProfile] Updating freelancer profile with ${Object.keys(updateData).length} fields`);
    } else { // client
      const { firstName, lastName, city, country, ...clientProfileData } = validatedFields.data as z.infer<typeof profileClientSchema>;
      updateData['profile.firstName'] = firstName;
      updateData['profile.lastName'] = lastName;
      updateData['profile.city'] = city;
      updateData['profile.country'] = country;
      updateData['clientProfile.companyName'] = clientProfileData.companyName;
      updateData['clientProfile.companySize'] = clientProfileData.companySize;
      updateData['clientProfile.industry'] = clientProfileData.industry;
      updateData['clientProfile.website'] = clientProfileData.website;
      updateData['clientProfile.description'] = clientProfileData.description;

      console.log(`👔 [updateProfile] Updating client profile with ${Object.keys(updateData).length} fields`);
    }

    await userRef.update(updateData);

    console.log(`✅ [updateProfile] Profile updated successfully for user ${userId}`);
    revalidatePath('/dashboard/profile');
    return {
      success: true,
      message: 'Профиль успешно обновлен!',
    };
  } catch (e) {
    console.error('❌ [updateProfile] Failed to update profile:', e);
    return {
      success: false,
      message: 'Что-то пошло не так. Пожалуйста, повторите попытку позже.',
    };
  }
}

export async function addPortfolioItem(
  data: z.infer<typeof portfolioItemSchema>
): Promise<PortfolioState> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  const validatedFields = portfolioItemSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }

  try {
    const portfolioRef = db.collection('users').doc(userId).collection('portfolio');
    const technologiesArray = typeof validatedFields.data.technologies === 'string'
      ? validatedFields.data.technologies.split(',').map(s => s.trim()).filter(Boolean)
      : validatedFields.data.technologies || [];

    await portfolioRef.add({
      ...validatedFields.data,
      technologies: technologiesArray,
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/dashboard/portfolio');
    return { success: true, message: 'Работа успешно добавлена в портфолио!' };
  } catch (error: any) {
    console.error('Failed to add portfolio item:', error);
    return { success: false, message: error.message || 'Не удалось добавить работу.' };
  }
}

export async function deletePortfolioItem(itemId: string): Promise<PortfolioState> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();

  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  if (!itemId) {
    return { success: false, message: 'Ошибка: Необходим ID работы.' };
  }

  try {
    console.log(`🗑️ [deletePortfolioItem] User ${userId} deleting item ${itemId}`);

    const itemRef = db.collection('users').doc(userId).collection('portfolio').doc(itemId);

    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return { success: false, message: 'Ошибка: Работа не найдена.' };
    }

    await itemRef.delete();

    console.log(`✅ [deletePortfolioItem] Item ${itemId} deleted successfully`);
    revalidatePath('/dashboard/portfolio');
    return { success: true, message: 'Работа успешно удалена!' };
  } catch (error: any) {
    console.error('❌ [deletePortfolioItem] Failed:', error);
    return { success: false, message: 'Не удалось удалить работу.' };
  }
}

export async function createProject(data: z.infer<typeof projectSchema> & { files?: any[] }): Promise<ProjectState> {
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists || userDoc.data()?.userType !== 'client') {
    return { success: false, message: 'Ошибка: Только клиенты могут создавать проекты.' };
  }

  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }

  try {
    const skillsArray = typeof validatedFields.data.skills === 'string'
      ? validatedFields.data.skills.split(',').map(s => s.trim()).filter(Boolean)
      : validatedFields.data.skills || [];

    await db.collection('projects').add({
      ...validatedFields.data,
      skills: skillsArray,
      files: data.files || [], // ✅ Сохраняем файлы
      clientId: userId,
      status: 'open',
      proposalsCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath('/jobs');
    revalidatePath('/marketplace');
    revalidatePath('/dashboard/projects');
    return { success: true, message: 'Проект успешно создан!' };
  } catch (error: any) {
    console.error('Failed to create project:', error);
    return { success: false, message: error.message || 'Не удалось создать проект.' };
  }
}

export async function updateProject(projectId: string, data: z.infer<typeof projectSchema> & { files?: any[] }): Promise<ProjectState> {
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  if (!projectId) {
    return { success: false, message: 'Ошибка: ID проекта не найден.' };
  }

  const projectRef = db.collection('projects').doc(projectId);
  const projectDoc = await projectRef.get();
  
  if (!projectDoc.exists) {
    return { success: false, message: 'Ошибка: Проект не найден.' };
  }
  
  if (projectDoc.data()?.clientId !== userId) {
    return { success: false, message: 'Ошибка: У вас нет прав на редактирование этого проекта.' };
  }

  const validatedFields = projectSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }

  try {
    const skillsArray = typeof validatedFields.data.skills === 'string'
      ? validatedFields.data.skills.split(',').map(s => s.trim()).filter(Boolean)
      : validatedFields.data.skills || [];

    await projectRef.update({
      ...validatedFields.data,
      skills: skillsArray,
      files: data.files || [], // ✅ Сохраняем файлы
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath(`/marketplace/jobs/${projectId}`);
    revalidatePath('/jobs');
    revalidatePath('/dashboard/projects');
    return { success: true, message: 'Проект успешно обновлен!' };
  } catch (error: any) {
    console.error('Failed to update project:', error);
    return { success: false, message: error.message || 'Не удалось обновить проект.' };
  }
}

export async function getProjectsByClientId(): Promise<Project[]> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();
  
  if (!userId) return [];

  try {
    const projectsRef = db.collection('projects');
    const q = projectsRef.where('clientId', '==', userId);
    const snapshot = await q.get();

    if (snapshot.empty) {
      return [];
    }

    const docsWithData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt,
    }));

    docsWithData.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });

    const projects: Project[] = docsWithData.map(data => ({
      id: data.id,
      title: data.title,
      description: data.description,
      budgetType: data.budgetType,
      budgetAmount: data.budgetAmount,
      skills: data.skills,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      clientId: data.clientId,
      status: data.status,
      proposalsCount: data.proposalsCount,
      freelancerId: data.freelancerId,
      deadline: data.deadline?.toDate?.()?.toISOString(),
      completedAt: data.completedAt?.toDate?.()?.toISOString(),
    }));

    return projects;
  } catch (error) {
    console.error('❌ [getProjectsByClientId] Error:', error);
    return [];
  }
}

export async function submitProposal(
  projectId: string,
  data: z.infer<typeof proposalSchema>
): Promise<ProposalState> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  if (!projectId) {
    return { success: false, message: 'Ошибка: ID проекта не найден.' };
  }

  // ✅ Проверяем что пользователь — фрилансер
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists || userDoc.data()?.userType !== 'freelancer') {
    return { success: false, message: 'Ошибка: Только фрилансеры могут отправлять предложения.' };
  }

  const validatedFields = proposalSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась. Пожалуйста, исправьте ошибки.',
      success: false,
    };
  }

  const projectRef = db.collection('projects').doc(projectId);
  const proposalsRef = projectRef.collection('proposals');

  try {
    // Получаем данные проекта
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      return { success: false, message: 'Ошибка: Проект не найден.' };
    }
    
    const projectData = projectDoc.data();
    const clientId = projectData?.clientId;
    const projectTitle = projectData?.title || 'Проект';

    // Нельзя откликаться на свой проект
    if (clientId === userId) {
      return { success: false, message: 'Ошибка: Вы не можете откликнуться на свой проект.' };
    }

    // Check for existing proposal
    const existingProposalQuery = proposalsRef.where('freelancerId', '==', userId);
    const existingProposalSnapshot = await existingProposalQuery.get();
    if (!existingProposalSnapshot.empty) {
      return { success: false, message: 'Вы уже подали предложение на этот проект.' };
    }

    // 1. Add proposal to subcollection
    await proposalsRef.add({
      freelancerId: userId,
      ...validatedFields.data,
      createdAt: FieldValue.serverTimestamp(),
      status: 'submitted',
    });

    // 2. Increment proposals count on the project
    await projectRef.update({
      proposalsCount: FieldValue.increment(1),
    });

    // 3. Create a notification for the client
    const userData = userDoc.data();
    const freelancerName = userData?.profile 
      ? `${userData.profile.firstName} ${userData.profile.lastName}`.trim()
      : 'Новый исполнитель';

    await db.collection('notifications').add({
      recipientId: clientId,
      senderId: userId,
      senderName: freelancerName,
      type: 'new_proposal',
      message: `${freelancerName} оставил отклик на ваш проект "${projectTitle}"`,
      entityId: projectId,
      entityType: 'project',
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath(`/marketplace/jobs/${projectId}`);
    revalidatePath('/dashboard/offers');
    return { success: true, message: 'Ваше предложение успешно отправлено!' };
  } catch (error: any) {
    console.error('Failed to submit proposal:', error);
    return { success: false, message: 'Произошла ошибка при отправке предложения.' };
  }
}

export async function updateProposal(
  proposalId: string,
  projectId: string,
  data: z.infer<typeof proposalSchema>
): Promise<ProposalState> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  const validatedFields = proposalSchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Проверка не удалась.', success: false };
  }

  try {
    const proposalRef = db.collection('projects').doc(projectId).collection('proposals').doc(proposalId);
    
    // ✅ Проверяем владельца proposal
    const proposalDoc = await proposalRef.get();
    if (!proposalDoc.exists) {
      return { success: false, message: 'Ошибка: Предложение не найдено.' };
    }
    
    if (proposalDoc.data()?.freelancerId !== userId) {
      return { success: false, message: 'Ошибка: У вас нет прав на редактирование этого предложения.' };
    }

    await proposalRef.update({
      ...validatedFields.data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    revalidatePath(`/marketplace/jobs/${projectId}`);
    revalidatePath('/dashboard/offers');
    return { success: true, message: 'Ваше предложение успешно обновлено!' };
  } catch (error: any) {
    return { success: false, message: 'Произошла ошибка при обновлении предложения.' };
  }
}

export async function deleteProposal(
  proposalId: string,
  projectId: string
): Promise<{ success: boolean, message: string }> {
  // ✅ SECURITY: Получаем userId на сервере
  const userId = await getUserId();
  
  if (!userId) {
    return { success: false, message: 'Ошибка: Необходима авторизация.' };
  }

  try {
    const projectRef = db.collection('projects').doc(projectId);
    const proposalRef = projectRef.collection('proposals').doc(proposalId);

    const proposalDoc = await proposalRef.get();
    if (!proposalDoc.exists) {
      return { success: false, message: 'Предложение не найдено.' };
    }
    
    if (proposalDoc.data()?.freelancerId !== userId) {
      return { success: false, message: 'У вас нет прав на удаление этого предложения.' };
    }

    await proposalRef.delete();
    await projectRef.update({ proposalsCount: FieldValue.increment(-1) });

    revalidatePath(`/marketplace/jobs/${projectId}`);
    revalidatePath('/dashboard/offers');
    return { success: true, message: 'Ваше предложение успешно удалено.' };
  } catch (error: any) {
    console.error("Failed to delete proposal:", error);
    return { success: false, message: 'Произошла ошибка при удалении предложения.' };
  }
}

// ========================================
// PROPOSALS - GET DATA
// ========================================

export async function getProposalsByFreelancer() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    console.log(`🔍 [getProposalsByFreelancer] Fetching proposals for freelancer ${userId}`);

    const proposalsSnapshot = await db.collectionGroup('proposals')
      .where('freelancerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (proposalsSnapshot.empty) {
      return [];
    }

    const proposalsWithProjects = await Promise.all(
      proposalsSnapshot.docs.map(async (proposalDoc) => {
        const proposalData = proposalDoc.data();
        const projectId = proposalDoc.ref.parent.parent?.id;

        if (!projectId) return null;

        const projectDoc = await db.collection('projects').doc(projectId).get();
        const projectData = projectDoc.exists ? projectDoc.data() : null;

        return {
          id: proposalDoc.id,
          projectId,
          projectTitle: projectData?.title || 'Неизвестный проект',
          bidAmount: proposalData.bidAmount,
          bidDuration: proposalData.bidDuration,
          coverLetter: proposalData.coverLetter,
          status: proposalData.status || 'submitted',
          createdAt: proposalData.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
      })
    );

    return proposalsWithProjects.filter(p => p !== null);
  } catch (error: any) {
    console.error('❌ [getProposalsByFreelancer] Error:', error);
    return [];
  }
}

export async function getProposalsByClient() {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    console.log(`🔍 [getProposalsByClient] Fetching proposals for client ${userId}`);

    const projectsSnapshot = await db.collection('projects')
      .where('clientId', '==', userId)
      .get();

    if (projectsSnapshot.empty) {
      return [];
    }

    const allProposals = await Promise.all(
      projectsSnapshot.docs.map(async (projectDoc) => {
        const projectData = projectDoc.data();
        const projectId = projectDoc.id;

        const proposalsSnapshot = await db.collection('projects')
          .doc(projectId)
          .collection('proposals')
          .orderBy('createdAt', 'desc')
          .get();

        if (proposalsSnapshot.empty) return [];

        const proposalsWithFreelancer = await Promise.all(
          proposalsSnapshot.docs.map(async (proposalDoc) => {
            const proposalData = proposalDoc.data();

            const freelancerDoc = await db.collection('users').doc(proposalData.freelancerId).get();
            const freelancerData = freelancerDoc.exists ? freelancerDoc.data() : null;

            return {
              id: proposalDoc.id,
              projectId,
              projectTitle: projectData.title,
              freelancerId: proposalData.freelancerId,
              freelancerName: freelancerData
                ? `${freelancerData.profile?.firstName || ''} ${freelancerData.profile?.lastName || ''}`.trim()
                : 'Неизвестный фрилансер',
              freelancerAvatar: freelancerData?.profile?.avatar || '',
              freelancerRating: freelancerData?.freelancerProfile?.rating || 0,
              freelancerTitle: freelancerData?.freelancerProfile?.title || '',
              bidAmount: proposalData.bidAmount,
              bidDuration: proposalData.bidDuration,
              coverLetter: proposalData.coverLetter,
              status: proposalData.status || 'submitted',
              createdAt: proposalData.createdAt?.toDate().toISOString() || new Date().toISOString(),
            };
          })
        );

        return proposalsWithFreelancer;
      })
    );

    return allProposals.flat().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error: any) {
    console.error('❌ [getProposalsByClient] Error:', error);
    return [];
  }
}

// ========================================
// DASHBOARD - GET STATS & DATA
// ========================================

export async function getDashboardStats(userType: 'freelancer' | 'client') {
  const userId = await getUserId();
  if (!userId) return null;

  try {
    console.log(`📊 [getDashboardStats] Fetching stats for ${userType} ${userId}`);

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (userType === 'freelancer') {
      // Получаем proposals через collection group
      const proposalsSnapshot = await db.collectionGroup('proposals')
        .where('freelancerId', '==', userId)
        .get();

      const totalProposals = proposalsSnapshot.size;
      const activeProjects = proposalsSnapshot.docs.filter(
        doc => doc.data().status === 'accepted'
      ).length;

      return {
        earnings: userData?.wallet?.balance || 0,
        activeProjects,
        rating: userData?.freelancerProfile?.rating || 0,
        reviewsCount: userData?.freelancerProfile?.reviewsCount || 0,
        totalProposals,
        invitations: 0,
      };
    } else {
      const projectsSnapshot = await db.collection('projects')
        .where('clientId', '==', userId)
        .get();

      const totalProjects = projectsSnapshot.size;
      const activeProjects = projectsSnapshot.docs.filter(doc => doc.data().status === 'in_progress').length;
      const openProjects = projectsSnapshot.docs.filter(doc => doc.data().status === 'open').length;
      const completedProjects = projectsSnapshot.docs.filter(doc => doc.data().status === 'completed').length;

      const hiredFreelancers = new Set(
        projectsSnapshot.docs.map(doc => doc.data().freelancerId).filter(Boolean)
      ).size;

      const proposalsCounts = await Promise.all(
        projectsSnapshot.docs.map(async (doc) => {
          const proposals = await db.collection('projects').doc(doc.id).collection('proposals').get();
          return proposals.size;
        })
      );

      return {
        moneySpent: userData?.clientProfile?.moneySpent || 0,
        activeProjects,
        openProjects,
        completedProjects,
        hiredFreelancers,
        totalProjects,
        totalProposalsReceived: proposalsCounts.reduce((a, b) => a + b, 0),
      };
    }
  } catch (error: any) {
    console.error('❌ [getDashboardStats] Error:', error);
    return null;
  }
}

export async function getRecentProjects(userType: 'freelancer' | 'client', limit: number = 5) {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    if (userType === 'freelancer') {
      // Получаем accepted proposals
      const proposalsSnapshot = await db.collectionGroup('proposals')
        .where('freelancerId', '==', userId)
        .where('status', '==', 'accepted')
        .get();

      const projects = await Promise.all(
        proposalsSnapshot.docs.slice(0, limit).map(async (proposalDoc) => {
          const proposalData = proposalDoc.data();
          const projectId = proposalDoc.ref.parent.parent?.id;
          if (!projectId) return null;

          const projectDoc = await db.collection('projects').doc(projectId).get();
          const projectData = projectDoc.exists ? projectDoc.data() : null;
          if (!projectData) return null;

          const clientDoc = await db.collection('users').doc(projectData.clientId).get();
          const clientData = clientDoc.exists ? clientDoc.data() : null;

          return {
            id: projectId,
            title: projectData.title,
            status: projectData.status || 'in_progress',
            budgetAmount: proposalData.bidAmount || projectData.budgetAmount,
            skills: projectData.skills || [],
            clientName: clientData
              ? `${clientData.profile?.firstName || ''} ${clientData.profile?.lastName || ''}`.trim()
              : 'Неизвестный клиент',
            createdAt: projectData.createdAt?.toDate().toISOString() || new Date().toISOString(),
          };
        })
      );

      return projects.filter(p => p !== null);
    } else {
      const projectsSnapshot = await db.collection('projects')
        .where('clientId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const projects = await Promise.all(
        projectsSnapshot.docs.map(async (projectDoc) => {
          const projectData = projectDoc.data();

          let freelancerName = null;
          if (projectData.freelancerId) {
            const freelancerDoc = await db.collection('users').doc(projectData.freelancerId).get();
            const freelancerData = freelancerDoc.exists ? freelancerDoc.data() : null;
            freelancerName = freelancerData
              ? `${freelancerData.profile?.firstName || ''} ${freelancerData.profile?.lastName || ''}`.trim()
              : 'Неизвестный фрилансер';
          }

          return {
            id: projectDoc.id,
            title: projectData.title,
            status: projectData.status || 'open',
            budgetAmount: projectData.budgetAmount,
            skills: projectData.skills || [],
            freelancerName,
            proposalsCount: projectData.proposalsCount || 0,
            createdAt: projectData.createdAt?.toDate().toISOString() || new Date().toISOString(),
          };
        })
      );

      return projects;
    }
  } catch (error: any) {
    console.error('❌ [getRecentProjects] Error:', error);
    return [];
  }
}

export async function getRecommendedProjects(limit: number = 5) {
  const userId = await getUserId();
  if (!userId) return [];

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const userSkills = userData?.freelancerProfile?.skills || [];

    const projectsSnapshot = await db.collection('projects')
      .where('status', '==', 'open')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    if (projectsSnapshot.empty) return [];

    if (userSkills.length === 0) {
      return projectsSnapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        title: doc.data().title,
        budgetAmount: doc.data().budgetAmount,
        skills: doc.data().skills || [],
      }));
    }

    const matchedProjects = projectsSnapshot.docs
      .map(doc => {
        const projectData = doc.data();
        const projectSkills = projectData.skills || [];

        const matchCount = projectSkills.filter((skill: string) =>
          userSkills.some((userSkill: string) =>
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        ).length;

        return {
          id: doc.id,
          title: projectData.title,
          budgetAmount: projectData.budgetAmount,
          skills: projectSkills,
          matchCount,
        };
      })
      .filter(p => p.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, limit);

    return matchedProjects.length > 0 
      ? matchedProjects 
      : projectsSnapshot.docs.slice(0, limit).map(doc => ({
          id: doc.id,
          title: doc.data().title,
          budgetAmount: doc.data().budgetAmount,
          skills: doc.data().skills || [],
        }));
  } catch (error: any) {
    console.error('❌ [getRecommendedProjects] Error:', error);
    return [];
  }
}

export async function setUserPassword(password: string): Promise<SetPasswordState> {
  const userId = await getUserId();

  if (!userId) {
    return { success: false, message: 'Ошибка: Пользователь не найден.' };
  }

  console.log(`🔍 setUserPassword called for userId: ${userId}`);

  const validatedFields = setPasswordSchema.safeParse({
    password,
    confirmPassword: password
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Проверка не удалась.',
      success: false,
    };
  }

  try {
    let currentAuthUser;
    try {
      currentAuthUser = await auth.getUser(userId);
      console.log(`👤 Current Auth User:`, {
        uid: currentAuthUser.uid,
        email: currentAuthUser.email,
        providers: currentAuthUser.providerData.map(p => p.providerId)
      });
    } catch (error: any) {
      console.error('❌ Failed to get current auth user:', error);
      return { success: false, message: 'Не удалось проверить данные пользователя.' };
    }

    if (!currentAuthUser.email) {
      return {
        success: false,
        message: 'Email не установлен. Вернитесь на шаг назад.'
      };
    }

    console.log(`📧 Setting password for user ${userId} with email ${currentAuthUser.email}`);

    // ✅ Устанавливаем пароль
    await auth.updateUser(userId, {
      password: password,
      emailVerified: false,
    });

    console.log(`✅ Password set successfully for user ${userId}`);

    // Обновляем Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      await db.collection('users').doc(userId).update({
        passwordSet: true,
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`✅ passwordSet flag updated in Firestore for user ${userId}`);
    }

    // ✅ Убрали requiresReauth — клиент сам выполнит автовход
    return {
      success: true,
      message: 'Пароль установлен!',
    };

  } catch (error: any) {
    console.error('❌ setUserPassword failed:', error);

    if (error.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'Этот email уже используется. Попробуйте другой email.'
      };
    }

    if (error.code === 'auth/invalid-password') {
      return {
        success: false,
        message: 'Пароль слишком слабый. Используйте минимум 6 символов.'
      };
    }

    return {
      success: false,
      message: error.message || 'Не удалось установить пароль.'
    };
  }
}

/**
 * Получить проекты фрилансера (где его proposal принят)
 */
export async function getProjectsByFreelancer() {
  const userId = await getUserId();
  if (!userId) return { active: [], completed: [] };

  try {
    console.log(`📂 [getProjectsByFreelancer] Fetching projects for freelancer ${userId}`);

    // Получаем все accepted proposals фрилансера
    const proposalsSnapshot = await db.collectionGroup('proposals')
      .where('freelancerId', '==', userId)
      .where('status', '==', 'accepted')
      .get();

    if (proposalsSnapshot.empty) {
      console.log(`ℹ️ [getProjectsByFreelancer] No accepted proposals for ${userId}`);
      return { active: [], completed: [] };
    }

    console.log(`✅ [getProjectsByFreelancer] Found ${proposalsSnapshot.size} accepted proposals`);

    // Получаем данные проектов
    const projects = await Promise.all(
      proposalsSnapshot.docs.map(async (proposalDoc) => {
        const proposalData = proposalDoc.data();
        const projectId = proposalDoc.ref.parent.parent?.id;

        if (!projectId) return null;

        const projectDoc = await db.collection('projects').doc(projectId).get();
        if (!projectDoc.exists) return null;

        const projectData = projectDoc.data();
        if (!projectData) return null;

        // Получаем данные клиента
        const clientDoc = await db.collection('users').doc(projectData.clientId).get();
        const clientData = clientDoc.exists ? clientDoc.data() : null;

        return {
          id: projectId,
          title: projectData.title,
          description: projectData.description,
          status: projectData.status || 'in_progress',
          budgetAmount: proposalData.bidAmount || projectData.budgetAmount,
          budgetType: projectData.budgetType,
          skills: projectData.skills || [],
          deadline: projectData.deadline?.toDate?.()?.toISOString(),
          completedAt: projectData.completedAt?.toDate?.()?.toISOString(),
          createdAt: projectData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          clientId: projectData.clientId,
          clientName: clientData
            ? `${clientData.profile?.firstName || ''} ${clientData.profile?.lastName || ''}`.trim() 
              || clientData.clientProfile?.companyName 
              || 'Неизвестный клиент'
            : 'Неизвестный клиент',
          clientAvatar: clientData?.profile?.avatar || '',
          // Данные из proposal
          bidAmount: proposalData.bidAmount,
          bidDuration: proposalData.bidDuration,
        };
      })
    );

    // Фильтруем null и разделяем по статусу
    const validProjects = projects.filter(p => p !== null);
    
    const active = validProjects.filter(p => 
      p.status === 'in_progress' || p.status === 'open'
    );
    
    const completed = validProjects.filter(p => 
      p.status === 'completed'
    );

    console.log(`✅ [getProjectsByFreelancer] Active: ${active.length}, Completed: ${completed.length}`);

    return { active, completed };

  } catch (error: any) {
    console.error('❌ [getProjectsByFreelancer] Error:', error);
    return { active: [], completed: [] };
  }
}