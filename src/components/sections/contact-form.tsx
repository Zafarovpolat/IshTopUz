"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useContext } from "react";
import type { z } from "zod";

import { submitLead } from "@/app/actions";
import { leadSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';

type LeadFormValues = z.infer<typeof leadSchema>;

export function ContactFormSection() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useContext(LanguageContext);
  const t = translations[language].contact;

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      role: undefined,
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    startTransition(async () => {
      const result = await submitLead(data);
      if (result.success) {
        toast({
          title: t.toast.successTitle,
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: t.toast.failTitle,
          description: result.message || t.toast.failDescription,
        });
      }
    });
  };

  return (
    <section id="contact" className="w-full bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl shadow-lg border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.title}</CardTitle>
            <CardDescription className="mt-2 text-lg text-muted-foreground">
              {t.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.form.name.label}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.form.name.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.form.email.label}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t.form.email.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.form.role.label}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.form.role.placeholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Freelancer">{t.form.role.freelancer}</SelectItem>
                          <SelectItem value="Client">{t.form.role.client}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                  {isPending ? t.form.submitting : t.form.submit}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
