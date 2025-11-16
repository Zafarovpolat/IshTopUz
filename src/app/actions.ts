
"use server";

import { z } from "zod";
import { leadSchema, surveyClientSchema, surveyFreelancerSchema, profileFreelancerSchema, profileClientSchema, onboardingSchema, portfolioItemSchema, projectSchema, proposalSchema, type Project } from "@/lib/schema";
import type { LeadState, SurveyState, ProfileState, OnboardingState, PortfolioState, ProjectState, ProposalState } from "@/lib/schema";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore, FieldValue, DocumentReference } from "firebase-admin/firestore";
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
    console.log(validatedFields.error.flatten().fieldErrors);
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
        revalidatePath(`/portfolio/${itemId}`);
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
