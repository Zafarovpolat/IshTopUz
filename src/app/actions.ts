
"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema, profileFreelancerSchema, profileClientSchema, onboardingSchema, portfolioItemSchema, projectSchema } from "@/lib/schema";
import type { LeadState, SurveyState, ProfileState, OnboardingState, PortfolioState, ProjectState } from "@/lib/schema";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';

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
  
  const { firstName, lastName, userType } = validatedFields.data;
  
  try {
    const userRecord = await auth.getUser(userId);
    const userRef = db.collection('users').doc(userId);

    const userData: any = {
      email: userRecord.email,
      phone: userRecord.phoneNumber || '',
      userType,
      isVerified: userRecord.emailVerified,
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
      profileComplete: true, // Assuming onboarding completes the basic profile
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
    
    await userRef.set(userData, { merge: true });

    return { success: true, message: "Профиль успешно создан." };
  } catch (error: any) {
    console.error("Onboarding failed:", error);
    return { success: false, message: error.message || 'Не удалось сохранить данные.' };
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
        const skillsArray = validatedFields.data.skills.split(',').map(s => s.trim()).filter(Boolean);

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
        return { success: true, message: 'Проект успешно создан!' };
    } catch (error: any) {
        console.error('Failed to create project:', error);
        return { success: false, message: error.message || 'Не удалось создать проект.' };
    }
}
