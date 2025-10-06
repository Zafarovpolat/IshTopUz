import { getDoc, doc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project, Proposal } from '@/lib/schema';
import { getAdminApp } from '@/lib/firebase-admin';
import { ProjectDetailsClient } from '@/components/project-details-client';
import { getUserId } from '@/lib/get-user-data';

async function getProjectData(id: string): Promise<Project | null> {
    const adminApp = getAdminApp();
    const firestore = adminApp.firestore();
    const projectDocRef = firestore.collection('projects').doc(id);
    const projectDoc = await projectDocRef.get();

    if (!projectDoc.exists) {
        return null;
    }

    const project = projectDoc.data();
    if (!project) return null;

    const clientDoc = await firestore.collection('users').doc(project.clientId).get();
    const clientData = clientDoc.exists ? clientDoc.data() : null;
    
    return {
        id: projectDoc.id,
        title: project.title,
        description: project.description,
        skills: project.skills || [],
        budgetType: project.budgetType,
        budgetAmount: project.budgetAmount,
        createdAt: project.createdAt.toDate().toISOString(),
        clientId: project.clientId,
        status: project.status,
        proposalsCount: project.proposalsCount || 0,
        files: project.files || [],
        client: clientData ? {
            name: `${clientData.profile.firstName || ''} ${clientData.profile.lastName || ''}`.trim() || clientData.clientProfile?.companyName || 'Анонимный заказчик',
            avatar: clientData.profile?.avatar,
            location: `${clientData.profile?.city || ''}, ${clientData.profile?.country || ''}`.replace(/^,|,$/g, '').trim() || 'Не указано',
            isVerified: clientData.isVerified || false,
            projectsPosted: clientData.clientProfile?.projectsPosted || 0,
            memberSince: clientData.createdAt ? clientData.createdAt.toDate().getFullYear() : '',
        } : null
    } as Project;
}

async function getProposals(projectId: string): Promise<Proposal[]> {
    const adminApp = getAdminApp();
    const firestore = adminApp.firestore();
    const proposalsRef = firestore.collection('projects').doc(projectId).collection('proposals');
    const q = query(proposalsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    const proposals: Proposal[] = [];
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const freelancerDoc = await firestore.collection('users').doc(data.freelancerId).get();
        
        if (freelancerDoc.exists) {
            const freelancerData = freelancerDoc.data();
            if (freelancerData) {
                proposals.push({
                    id: docSnap.id,
                    ...data,
                    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
                    freelancer: {
                        name: `${freelancerData.profile.firstName} ${freelancerData.profile.lastName}`,
                        avatar: freelancerData.profile.avatar,
                        rating: freelancerData.freelancerProfile?.rating || 0,
                        title: freelancerData.freelancerProfile?.title || ''
                    }
                } as Proposal);
            }
        }
    }
    return proposals;
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const projectData = await getProjectData(params.id);
    const proposalsData = projectData ? await getProposals(params.id) : [];
    const currentUserId = await getUserId();
    
    return <ProjectDetailsClient initialProject={projectData} initialProposals={proposalsData} currentUserId={currentUserId} />;
}
