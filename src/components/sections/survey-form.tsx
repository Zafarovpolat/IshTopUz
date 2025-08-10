"use client";

import { useSearchParams } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTransition } from "react"
import type { z } from "zod"

import { surveyFreelancerSchema, surveyClientSchema } from "@/lib/schema"
import { submitSurvey } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { clientQuestions, freelancerQuestions } from '@/lib/survey-questions';

type FreelancerFormValues = z.infer<typeof surveyFreelancerSchema>;
type ClientFormValues = z.infer<typeof surveyClientSchema>;

export function SurveyForm() {
    const searchParams = useSearchParams()
    const role = searchParams.get('role') as "Freelancer" | "Client" | null;
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const schema = role === 'Freelancer' ? surveyFreelancerSchema : surveyClientSchema;
    
    const form = useForm<FreelancerFormValues | ClientFormValues>({
        resolver: zodResolver(schema),
        defaultValues: role === 'Freelancer' ? {
            profession: undefined,
            experience: undefined,
            platforms: [],
            paymentIssues: undefined,
            localPaymentSystems: undefined,
            commissionAgreement: undefined,
            useTelegram: undefined,
            aiAssistant: undefined,
            desiredFeatures: "",
            betaTest: undefined
        } : {
            services: [],
            businessType: undefined,
            platforms: [],
            qualityIssues: undefined,
            localPaymentSystems: undefined,
            commissionAttractiveness: undefined,
            useSocials: undefined,
            verificationValue: undefined,
            hiringDifficulties: "",
            betaTest: undefined
        }
    });

    const onSubmit = (data: FreelancerFormValues | ClientFormValues) => {
        if (!role) return;
        startTransition(async () => {
            const result = await submitSurvey(data, role);
            if (result.success) {
              toast({
                title: "Опрос успешно пройден!",
                description: result.message,
              });
              form.reset();
              // Optionally redirect to a thank you page
              // router.push('/thank-you');
            } else {
              toast({
                variant: "destructive",
                title: "Ошибка отправки",
                description: result.message || "Проверьте введенные данные и попробуйте еще раз.",
              });
            }
        });
    };

    const questions = role === 'Freelancer' ? freelancerQuestions : clientQuestions;

    if (!role) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Роль не указана. Пожалуйста, вернитесь на главную страницу и зарегистрируйтесь.</p>
            </div>
        )
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
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...(field.value || []), item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value: string) => value !== item.id
                                                    )
                                                    )
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                        ))}
                    </div>
                );
            case 'textarea':
                return <Textarea placeholder={question.placeholder} {...field} />;
            default:
                return <Input placeholder={question.placeholder} {...field} />;
        }
    }

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg border-border/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">Опрос для {role === 'Freelancer' ? 'фрилансеров' : 'заказчиков'}</CardTitle>
                    <CardDescription className="mt-2 text-base sm:text-lg text-muted-foreground">
                        Пожалуйста, ответьте на несколько вопросов. Это поможет нам сделать платформу лучше.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                            {questions.map((q) => (
                                <FormField
                                    key={q.id}
                                    control={form.control}
                                    name={q.id as any}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{q.label}</FormLabel>
                                            {renderFormField(q, field)}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button type="submit" className="w-full text-base mt-8" size="lg" disabled={isPending}>
                                {isPending ? "Отправка..." : "Отправить ответы"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
