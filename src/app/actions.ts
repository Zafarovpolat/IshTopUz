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
  if (!userId) {
    return { success: false, message: 'Ошибка: Пользователь не найден.' };
  }

  const userRef = db.collection('users').doc(userId);

  // Special case for only updating the avatar
  if ('avatar' in data && Object.keys(data).length === 1) {
    try {
      await userRef.update({ 'profile.avatar': data.avatar });
      revalidatePath('/dashboard/profile');
      return { success: true, message: 'Аватар успешно обновлен!' };
    } catch (e) {
      console.error('Failed to update avatar:', e);
      return { success: false, message: 'Не удалось обновить аватар.' };
    }
  }

  const schema = userType === 'freelancer' ? profileFreelancerSchema : profileClientSchema;
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
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
    }

    await userRef.update(updateData);
    revalidatePath('/dashboard/profile');
    return {
      success: true,
      message: 'Профиль успешно обновлен!',
    };
  } catch (e) {
    console.error('Failed to update profile:', e);
    return {
      success: false,
      message: 'Что-то пошло не так. Пожалуйста, повторите попытку позже.',
    };
  }
}

export async function addPortfolioItem(
  userId: string,
  data: z.infer<typeof portfolioItemSchema>
): Promise<PortfolioState> {
  if (!userId) {
    return { success: false, message: 'Ошибка: Пользователь не найден.' };
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
      : [];

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

export async function deletePortfolioItem(userId: string, itemId: string): Promise<PortfolioState> {
  if (!userId || !itemId) {
    return { success: false, message: 'Ошибка: Необходим ID пользователя и ID работы.' };
  }

  try {
    const itemRef = db.collection('users').doc(userId).collection('portfolio').doc(itemId);
    await itemRef.delete();

    revalidatePath('/dashboard/portfolio');
    return { success: true, message: 'Работа успешно удалена!' };
  } catch (error: any) {
    console.error('Failed to delete portfolio item:', error);
    return { success: false, message: 'Не удалось удалить работу.' };
  }
}


export async function createProject(userId: string, data: z.infer<typeof projectSchema>): Promise<ProjectState> {
  if (!userId) {
    return { success: false, message: 'Ошибка: Пользователь не найден.' };
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
      : [];

    await db.collection('projects').add({
      ...validatedFields.data,
      skills: skillsArray,
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

export async function updateProject(projectId: string, data: z.infer<typeof projectSchema>): Promise<ProjectState> {
  if (!projectId) {
    return { success: false, message: 'Ошибка: ID проекта не найден.' };
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
    const projectRef = db.collection('projects').doc(projectId);
    const skillsArray = typeof validatedFields.data.skills === 'string'
      ? validatedFields.data.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    await projectRef.update({
      ...validatedFields.data,
      skills: skillsArray,
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


export async function getProjectsByClientId(clientId: string): Promise<Project[]> {
  if (!clientId) return [];

  const projectsRef = db.collection('projects');
  const q = projectsRef.where('clientId', '==', clientId);
  const snapshot = await q.get();

  if (snapshot.empty) {
    return [];
  }

  const docsWithData = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt,
  }));

  docsWithData.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());


  const projects: Project[] = docsWithData.map(data => {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      budgetType: data.budgetType,
      budgetAmount: data.budgetAmount,
      skills: data.skills,
      createdAt: data.createdAt.toDate().toISOString(),
      clientId: data.clientId,
      status: data.status,
      proposalsCount: data.proposalsCount,
      freelancerId: data.freelancerId,
      deadline: data.deadline?.toDate().toISOString(),
      completedAt: data.completedAt?.toDate().toISOString(),
    };
  });

  return projects;
}

export async function submitProposal(
  freelancerId: string,
  projectId: string,
  projectTitle: string,
  clientId: string,
  data: z.infer<typeof proposalSchema>
): Promise<ProposalState> {
  if (!freelancerId || !projectId || !clientId) {
    return { success: false, message: 'Ошибка: Необходимы ID фрилансера, проекта и клиента.' };
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
    // Check for existing proposal
    const existingProposalQuery = proposalsRef.where('freelancerId', '==', freelancerId);
    const existingProposalSnapshot = await existingProposalQuery.get();
    if (!existingProposalSnapshot.empty) {
      return { success: false, message: 'Вы уже подали предложение на этот проект.' };
    }

    // 1. Add proposal to subcollection
    await proposalsRef.add({
      freelancerId,
      ...validatedFields.data,
      createdAt: FieldValue.serverTimestamp(),
      status: 'submitted',
    });

    // 2. Increment proposals count on the project
    await projectRef.update({
      proposalsCount: FieldValue.increment(1),
    });

    // 3. Create a notification for the client
    const freelancerDoc = await db.collection('users').doc(freelancerId).get();
    const freelancerName = freelancerDoc.exists ? `${freelancerDoc.data()?.profile.firstName} ${freelancerDoc.data()?.profile.lastName}` : 'Новый исполнитель';

    await db.collection('notifications').add({
      recipientId: clientId,
      senderId: freelancerId,
      senderName: freelancerName,
      type: 'new_proposal',
      message: `${freelancerName} оставил отклик на ваш проект "${projectTitle}"`,
      entityId: projectId,
      entityType: 'project',
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });

    revalidatePath(`/marketplace/jobs/${projectId}`);
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
  const validatedFields = proposalSchema.safeParse(data);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Проверка не удалась.', success: false };
  }

  try {
    const proposalRef = db.collection('projects').doc(projectId).collection('proposals').doc(proposalId);
    await proposalRef.update({
      ...validatedFields.data,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath(`/marketplace/jobs/${projectId}`);
    return { success: true, message: 'Ваше предложение успешно обновлено!' };
  } catch (error: any) {
    return { success: false, message: 'Произошла ошибка при обновлении предложения.' };
  }
}


export async function deleteProposal(
  proposalId: string,
  projectId: string,
  freelancerId: string
): Promise<{ success: boolean, message: string }> {

  try {
    const projectRef = db.collection('projects').doc(projectId);
    const proposalRef = projectRef.collection('proposals').doc(proposalId);

    const proposalDoc = await proposalRef.get();
    if (!proposalDoc.exists || proposalDoc.data()?.freelancerId !== freelancerId) {
      return { success: false, message: 'Предложение не найдено или у вас нет прав на его удаление.' };
    }

    await proposalRef.delete();
    await projectRef.update({ proposalsCount: FieldValue.increment(-1) });

    revalidatePath(`/marketplace/jobs/${projectId}`);
    return { success: true, message: 'Ваше предложение успешно удалено.' };
  } catch (error: any) {
    console.error("Failed to delete proposal:", error);
    return { success: false, message: 'Произошла ошибка при удалении предложения.' };
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
        passwordSet: true,  // ✅ Устанавливаем в true
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`✅ passwordSet flag updated in Firestore for user ${userId}`);
    }

    // ✅ ВСЕГДА требуем реавторизацию после установки пароля
    return {
      success: true,
      message: 'Пароль установлен! Войдите с новым паролем.',
      requiresReauth: true, // ✅ Обязательная реавторизация
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