"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
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

type LeadFormValues = z.infer<typeof leadSchema>;

export function ContactFormSection() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
          title: "Заявка успешно отправлена!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка отправки",
          description: result.message || "Проверьте введенные данные и попробуйте еще раз.",
        });
      }
    });
  };

  return (
    <section id="contact" className="w-full bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl shadow-lg border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{"Присоединяйтесь к бета-тесту"}</CardTitle>
            <CardDescription className="mt-2 text-base sm:text-lg text-muted-foreground">
              {"Будьте в числе первых, кто получит доступ к платформе."}
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
                      <FormLabel>{"Полное имя"}</FormLabel>
                      <FormControl>
                        <Input placeholder={"Иван Иванов"} {...field} />
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
                      <FormLabel>{"Адрес электронной почты"}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={"you@example.com"} {...field} />
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
                      <FormLabel>{"Я..."}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={"Выберите вашу роль"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Freelancer">{"Фрилансер"}</SelectItem>
                          <SelectItem value="Client">{"Заказчик"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-base" size="lg" disabled={isPending}>
                  {isPending ? "Отправка..." : "Получить доступ к бета-версии"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
