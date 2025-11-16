'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import type { z } from 'zod';
import { surveyFreelancerSchema, surveyClientSchema } from '@/lib/schema';
import { submitSurvey } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { clientQuestions, freelancerQuestions } from '@/lib/survey-questions';

type FreelancerFormValues = z.infer<typeof surveyFreelancerSchema>;
type ClientFormValues = z.infer<typeof surveyClientSchema>;

export function SurveyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const role = searchParams.get('role') as 'Freelancer' | 'Client' | null;
    const leadId = searchParams.get('leadId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const schema = role === 'Freelancer' ? surveyFreelancerSchema : surveyClientSchema;

    const form = useForm<FreelancerFormValues | ClientFormValues>({
        resolver: zodResolver(schema),
        defaultValues: role === 'Freelancer' ? {
            name: name || '',
            email: email || '',
            leadId: leadId || undefined,
            profession: undefined,
            experience: undefined,
            platforms: [],
            paymentIssues: undefined,
            localPaymentSystems: undefined,
            commissionAgreement: undefined,
            useTelegram: undefined,
            desiredFeatures: '',
            betaTest: undefined,
        } : {
            name: name || '',
            email: email || '',
            leadId: leadId || undefined,
            services: [],
            businessType: undefined,
            platforms: [],
            qualityIssues: undefined,
            localPaymentSystems: undefined,
            commissionAttractiveness: undefined,
            useSocials: undefined,
            verificationValue: undefined,
            hiringDifficulties: '',
            betaTest: undefined,
        },
    });

    const onSubmit = (data: FreelancerFormValues | ClientFormValues) => {
        if (!role) return;
        startTransition(async () => {
            const result = await submitSurvey(data, role);
            if (result.success) {
                toast({
                    title: 'Опрос успешно пройден!',
                    description: result.message,
                });
                form.reset();
                router.push('/');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка отправки',
                    description: result.message || 'Проверьте соединение и попробуйте снова.',
                });
            }
        });
    };

    const questions = role === 'Freelancer' ? freelancerQuestions : clientQuestions;

    if (!role || !name || !email) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Роль, имя или email не указаны. Пожалуйста, вернитесь на главную страницу и зарегистрируйтесь.</p>
            </div>
        );
    }

    const renderFormField = (question: any, field: any) => {
        switch (question.type) {
            case 'select':
                return (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={question.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {question.options.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'checkbox':
                return (
                    <div className="flex flex-col gap-2">
                        {question.options.map((item: any) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name={question.id as any}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), item.id])
                                                        : field.onChange(field.value?.filter((value: string) => value !== item.id));
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal">{item.label}</FormLabel>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                );
            case 'textarea':
                return <Textarea placeholder={question.placeholder} {...field} />;
            default:
                return <Input placeholder={question.placeholder} {...field} />;
        }
    };

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg border-border/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Опрос для {role === 'Freelancer' ? 'фрилансеров' : 'заказчиков'}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base sm:text-lg text-muted-foreground">
                        Пожалуйста, ответьте на несколько вопросов, {name}. Это поможет нам сделать платформу лучше.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                            {questions.map((q) => (
                                <FormField
                                    key={q.id}
                                    control={form.control}
                                    name={q.id as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{q.label}</FormLabel>
                                            <FormControl>{renderFormField(q, field)}</FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button type="submit" className="w-full text-base" size="lg" disabled={isPending}>
                                {isPending ? 'Отправка...' : 'Отправить ответы'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
