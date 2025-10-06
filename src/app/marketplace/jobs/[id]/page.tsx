
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { proposalSchema, type Project, type Proposal } from '@/lib/schema';
import { submitProposal } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Verified, Briefcase, DollarSign, Clock, Star, Paperclip, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { getAdminApp } from '@/lib/firebase-admin';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getDoc, doc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ProposalFormValues = z.infer<typeof proposalSchema>;

async function getProjectData(id: string): Promise<Project | null> {
    const projectDocRef = doc(db, 'projects', id);
    const projectDoc = await getDoc(projectDocRef);

    if (!projectDoc.exists()) {
        return null;
    }

    const project = projectDoc.data();
    if (!project) return null;

    const clientDoc = await getDoc(doc(db, 'users', project.clientId));
    const clientData = clientDoc.exists() ? clientDoc.data() : null;
    
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
    const proposalsRef = collection(db, 'projects', projectId, 'proposals');
    const q = query(proposalsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return [];
    }
    
    const proposals: Proposal[] = [];
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const freelancerDoc = await getDoc(doc(db, 'users', data.freelancerId));
        
        if (freelancerDoc.exists()) {
            const freelancerData = freelancerDoc.data();
            proposals.push({
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt.toDate().toISOString(),
                freelancer: {
                    name: `${freelancerData.profile.firstName} ${freelancerData.profile.lastName}`,
                    avatar: freelancerData.profile.avatar,
                    rating: freelancerData.freelancerProfile?.rating || 0,
                    title: freelancerData.freelancerProfile?.title || ''
                }
            } as Proposal);
        }
    }
    return proposals;
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const { user: currentUser, isLoading: isUserLoading } = useAuth();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [project, setProject] = useState<Project | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<ProposalFormValues>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            bidAmount: undefined,
            bidDuration: undefined,
            coverLetter: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const projectData = await getProjectData(params.id);
                setProject(projectData);
                if (projectData) {
                    const proposalData = await getProposals(params.id);
                    setProposals(proposalData);
                }
            } catch (error) {
                console.error("Failed to fetch project data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id]);


    const onSubmit = (data: ProposalFormValues) => {
        if (!currentUser || !project) return;
        startTransition(async () => {
            const result = await submitProposal(currentUser.uid, project.id, project.title, project.clientId, data);
            if (result.success) {
                toast({ title: 'Успешно!', description: result.message });
                form.reset();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: result.message,
                });
            }
        });
    };

    if (isLoading || isUserLoading) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
                <h1 className="text-2xl font-bold">Проект не найден</h1>
                <p className="text-muted-foreground">Возможно, он был удален или ссылка неверна.</p>
                <Button asChild className="mt-4">
                    <Link href="/jobs">Вернуться на биржу</Link>
                </Button>
            </div>
        )
    }

    const timeAgo = formatDistanceToNow(new Date(project.createdAt), { addSuffix: true, locale: ru });
    const budget = `${project.budgetAmount.toLocaleString('ru-RU')} UZS`;
    const isOwner = currentUser?.uid === project.clientId;

    return (
        <main className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <Badge variant="outline" className="w-fit mb-2">Опубликован {timeAgo}</Badge>
                            <CardTitle className="text-3xl">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{project.description}</p>
                            <Separator className="my-6" />
                            <h3 className="font-semibold mb-3">Необходимые навыки</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill: string) => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div id="proposals">
                        <h2 className="text-2xl font-bold mb-4">Предложения ({proposals.length})</h2>
                        {proposals.length > 0 ? (
                            <div className="space-y-6">
                                {proposals.map(p => (
                                    <Card key={p.id}>
                                        <CardHeader className="flex flex-row justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={p.freelancer.avatar} alt={p.freelancer.name} />
                                                    <AvatarFallback>{p.freelancer.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{p.freelancer.name}</p>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{p.freelancer.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{p.bidAmount.toLocaleString('ru-RU')} UZS</p>
                                                <p className="text-xs text-muted-foreground">Ставка</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{p.coverLetter}"</p>
                                        </CardContent>
                                        {isOwner && (
                                            <CardFooter className="gap-2">
                                                <Button size="sm">Нанять</Button>
                                                <Button size="sm" variant="outline">Сообщение</Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center p-8 border-dashed">
                                <CardTitle className="text-lg font-normal">Предложений пока нет</CardTitle>
                                <CardDescription>Будьте первым, кто откликнется на этот проект.</CardDescription>
                            </Card>
                        )}
                    </div>
                    
                    {currentUser && !isOwner && (
                         <Card id="submit-proposal">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <CardHeader>
                                        <CardTitle>Подать предложение</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name="bidAmount" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ваша ставка (UZS)</FormLabel>
                                                    <FormControl><Input type="number" placeholder="3000000" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="bidDuration" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Срок выполнения (дни)</FormLabel>
                                                    <FormControl><Input type="number" placeholder="5" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <FormField control={form.control} name="coverLetter" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Сопроводительное письмо</FormLabel>
                                                <FormControl><Textarea placeholder="Расскажите, почему именно вы подходите для этого проекта..." rows={5} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                    <CardFooter>
                                        <Button type="submit" size="lg" disabled={isPending}>
                                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                            {isPending ? 'Отправка...' : 'Отправить предложение'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Form>
                         </Card>
                    )}
                    {!currentUser && !isUserLoading && (
                        <Card className="text-center p-8">
                            <CardTitle>Хотите выполнить этот проект?</CardTitle>
                            <CardDescription className="mt-2">Войдите в свой аккаунт или зарегистрируйтесь, чтобы подать предложение.</CardDescription>
                            <Button asChild size="lg" className="mt-6">
                                <Link href="/auth">Войти и подать заявку</Link>
                            </Button>
                        </Card>
                    )}
                </div>
                <div className="space-y-6 lg:sticky lg:top-24 self-start">
                    {project.client && (
                        <Card>
                            <CardHeader>
                                <CardTitle>О заказчике</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={(project.client as any).avatar} />
                                        <AvatarFallback>{(project.client as any).name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {(project.client as any).name}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{(project.client as any).location}</span>
                                </div>
                                {(project.client as any).isVerified && (
                                    <div className="flex items-center gap-2 text-green-600 font-medium">
                                        <Verified className="h-4 w-4" />
                                        <span>Верифицированный клиент</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{(project.client as any).projectsPosted} проектов опубликовано</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>На сайте с {(project.client as any).memberSince} г.</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Информация о проекте</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{budget}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span>{project.budgetType === 'fixed' ? 'Проект с фикс. оплатой' : 'Почасовая работа'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
