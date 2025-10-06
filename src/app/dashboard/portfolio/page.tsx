
import { getUserId, getUserData } from '@/lib/get-user-data';
import { redirect } from 'next/navigation';
import { getAdminApp } from '@/lib/firebase-admin';
import type { PortfolioItem } from '@/lib/schema';
import { PortfolioClientPage } from '@/components/dashboard/portfolio-client-page';

async function getPortfolioItems(userId: string): Promise<PortfolioItem[]> {
    const adminApp = getAdminApp();
    const db = adminApp.firestore();
    const portfolioSnapshot = await db.collection('users').doc(userId).collection('portfolio').orderBy('createdAt', 'desc').get();
    
    if (portfolioSnapshot.empty) {
        return [];
    }

    const items: PortfolioItem[] = portfolioSnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        projectUrl: data.projectUrl,
        technologies: data.technologies || [],
        createdAt: createdAt.toISOString(),
      }
    });

    return items;
}

export default async function PortfolioPage() {
    const userId = await getUserId();
    const userData = await getUserData();

    if (!userId || !userData) {
        redirect('/auth');
    }

    if (userData.userType !== 'freelancer') {
        redirect('/dashboard');
    }

    const portfolioItems = await getPortfolioItems(userId);

    return <PortfolioClientPage initialItems={portfolioItems} userId={userId} />;
}
