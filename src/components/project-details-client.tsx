
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { proposalSchema, type Project, type Proposal } from '@/lib/schema';
import { submitProposal, updateProposal, deleteProposal } from '@/app/actions';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Verified, Briefcase, DollarSign, Clock, Star, Send, Loader2, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

type ProposalFormValues = z.infer<typeof proposalSchema>;

function ProposalForm({ project, freelancerId, existingProposal, onFormSubmit }: {
    project: Project;
    freelancerId: string;
    existingProposal?: Proposal | null;
    onFormSubmit: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const isEditMode = !!existingProposal;

    const form = useForm<ProposalFormValues>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            bidAmount: existingProposal?.bidAmount || undefined,
            bidDuration: existingProposal?.bidDuration || undefined,
            coverLetter: existingProposal?.coverLetter || '',
        },
    });
    
    useEffect(() => {
        form.reset({
            bidAmount: existingProposal?.bidAmount || undefined,
            bidDuration: existingProposal?.bidDuration || undefined,
            coverLetter: existingProposal?.coverLetter || '',
        });
    }, [existingProposal, form]);

    const onSubmit = (data: ProposalFormValues) => {
        startTransition(async () => {
            const result = isEditMode
              ? await updateProposal(existingProposal.id, project.id, data)
              : await submitProposal(freelancerId, project.id, project.title, project.clientId, data);
            
            if (result.success) {
                toast({ title: 'Успешно!', description: result.message });
                onFormSubmit();
                router.refresh();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: result.message || 'Произошла непредвиденная ошибка.',
                });
            }
        });
    };

    return (
        <Card id="submit-proposal">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>{isEditMode ? 'Редактировать предложение' : 'Подать предложение'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="bidAmount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ваша ставка (UZS)</FormLabel>
                                    <FormControl><Input type="number" placeholder="3000000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="bidDuration" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Срок выполнения (дни)</FormLabel>
                                    <FormControl><Input type="number" placeholder="5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
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
                            {isPending ? (isEditMode ? 'Сохранение...' : 'Отправка...') : (isEditMode ? 'Сохранить изменения' : 'Отправить предложение')}
                        </Button>
                         {isEditMode && (
                            <Button type="button" variant="ghost" onClick={onFormSubmit} className="ml-2">
                                Отмена
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

function YourProposalCard({ proposal, onEdit, onDelete }: { proposal: Proposal, onEdit: () => void, onDelete: (proposalId: string) => void }) {
    const [isDeleting, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => {
            onDelete(proposal.id);
        });
    }

    return (
        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle>Ваше предложение</CardTitle>
                <CardDescription>Вы уже откликнулись на этот проект. Вы можете отредактировать или отозвать свое предложение.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Предложенная ставка</p>
                        <p className="text-lg font-bold">{proposal.bidAmount.toLocaleString('ru-RU')} UZS</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Срок</p>
                        <p className="text-lg font-bold text-right">{proposal.bidDuration} дней</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{proposal.coverLetter}"</p>
            </CardContent>
            <CardFooter className="gap-2">
                <Button onClick={onEdit}><Edit className="mr-2 h-4 w-4"/>Редактировать</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/>Отозвать</Button>
                    </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Это действие нельзя будет отменить. Ваше предложение будет удалено.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? "Удаление..." : "Да, отозвать"}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}


export function ProjectDetailsClient({ initialProject, initialProposals, currentUserId }: { initialProject: Project | null, initialProposals: Proposal[], currentUserId: string | null }) {
    const { toast } = useToast();
    const router = useRouter();
    const [project] = useState<Project | null>(initialProject);
    const [proposals] = useState<Proposal[]>(initialProposals);
    const { user: authUser, isLoading: isUserLoading } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);

    const currentUserProposal = proposals.find(p => p.freelancerId === currentUserId);
    const isOwner = currentUserId === project?.clientId;


    const handleDelete = async (proposalId: string) => {
        if (!project || !currentUserId) return;
        const result = await deleteProposal(proposalId, project.id, currentUserId);
         if (result.success) {
            toast({ title: 'Успешно!', description: result.message });
            router.refresh();
        } else {
            toast({ variant: 'destructive', title: 'Ошибка', description: result.message });
        }
    }

    if (isUserLoading) {
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
                                    p.freelancerId !== currentUserId && (
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
                                    )
                                ))}
                            </div>
                        ) : (
                             !currentUserProposal && (
                                <Card className="text-center p-8 border-dashed">
                                    <CardTitle className="text-lg font-normal">Предложений пока нет</CardTitle>
                                    <CardDescription>Будьте первым, кто откликнется на этот проект.</CardDescription>
                                </Card>
                            )
                        )}
                    </div>
                    
                     {authUser && !isOwner && (
                        currentUserProposal && !isEditing ? (
                            <YourProposalCard 
                                proposal={currentUserProposal} 
                                onEdit={() => setIsEditing(true)}
                                onDelete={handleDelete}
                            />
                        ) : (
                            <ProposalForm
                                project={project}
                                freelancerId={currentUserId!}
                                existingProposal={isEditing ? currentUserProposal : null}
                                onFormSubmit={() => setIsEditing(false)}
                            />
                        )
                    )}

                    {!authUser && !isUserLoading && (
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
