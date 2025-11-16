
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getAdminApp } from '@/lib/firebase-admin';
import type { PortfolioItem } from '@/lib/schema';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

async function getPortfolioItem(itemId: string): Promise<PortfolioItem | null> {
    const db = getAdminApp().firestore();
    // This is a simplification. In a real app, you'd need to find which user this item belongs to.
    // For now, we assume we can find it. A better structure would be a top-level `portfolioItems` collection.
    // Let's try to find it across all users for this demo.
    const querySnapshot = await db.collectionGroup('portfolio').where('__name__', '==', `portfolio/${itemId}`).get();
    
    // A more robust but slower way is to iterate through users, but collectionGroup query is better.
    // Firestore path for a subcollection doc is `users/{userId}/portfolio/{portfolioId}`
    // But we don't have userId from just the portfolioId.
    // The query above won't work as __name__ refers to the full path. We can't query by just doc ID.
    // This highlights a data modeling issue. A top-level collection would be better.
    
    // Let's find it the slow way for now.
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
        const itemRef = db.collection('users').doc(userDoc.id).collection('portfolio').doc(itemId);
        const itemDoc = await itemRef.get();
        if (itemDoc.exists) {
            const data = itemDoc.data();
            if (data) {
                 return {
                    id: itemDoc.id,
                    title: data.title,
                    description: data.description,
                    mainImageUrl: data.mainImageUrl,
                    galleryImageUrls: data.galleryImageUrls || [],
                    projectUrl: data.projectUrl,
                    technologies: data.technologies || [],
                    category: data.category,
                    createdAt: data.createdAt.toDate().toISOString(),
                };
            }
        }
    }

    return null;
}


export default async function PortfolioItemPage({ params }: { params: { id: string } }) {
    const item = await getPortfolioItem(params.id);

    if (!item) {
        notFound();
    }
    
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div>
                        <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                        <h1 className="text-4xl font-bold tracking-tight">{item.title}</h1>
                    </div>

                    {/* Main Image */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <Image src={item.mainImageUrl} alt={item.title} fill className="object-cover" />
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 prose lg:prose-lg max-w-none">
                            <p>{item.description}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-lg">Технологии</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.technologies.map(tech => (
                                        <Badge key={tech}>{tech}</Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            {item.projectUrl && (
                                <div>
                                    <h3 className="font-semibold mb-2 text-lg">Ссылка на проект</h3>
                                    <Button asChild variant="outline">
                                        <Link href={item.projectUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Посмотреть вживую
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery */}
                    {item.galleryImageUrls && item.galleryImageUrls.length > 0 && (
                        <div>
                             <h2 className="text-3xl font-bold tracking-tight mb-6">Галерея проекта</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {item.galleryImageUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                        <Image src={url} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
