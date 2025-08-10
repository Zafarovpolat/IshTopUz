"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Lock, Wallet } from 'lucide-react';

export function Benefits() {

  const benefits = [
    {
      icon: Lock,
      title: "Гарантия оплаты",
      description: "Безопасные сделки через escrow-счета. Ваши средства в безопасности до полного утверждения работы."
    },
    {
      icon: Wallet,
      title: "Низкая комиссия",
      description: "Наша комиссия — всего 5%, что значительно ниже 10-20% на других платформах. Ваш заработок остается с вами."
    },
    {
      icon: Globe,
      title: "Локализация для Узбекистана",
      description: "Платформа, созданная для рынка Узбекистана с поддержкой узбекского, русского и английского языков и удобной интеграцией с Telegram."
    }
  ];

  return (
    <section id="benefits" className="w-full bg-secondary/50 py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{"Почему выбирают IshTop.Uz?"}</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{"Лучшие возможности для фрилансеров и заказчиков в Узбекистане."}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="flex flex-col items-center p-8 text-center bg-background shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <benefit.icon className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="mb-2 text-xl font-semibold">{benefit.title}</CardTitle>
                <p className="text-base text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
