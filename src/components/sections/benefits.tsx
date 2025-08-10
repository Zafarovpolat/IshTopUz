"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Lock, Wallet } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';

export function Benefits() {
  const { language } = useContext(LanguageContext);
  const t = translations[language].benefits;

  const benefits = [
    {
      icon: Lock,
      title: t.paymentGuarantee.title,
      description: t.paymentGuarantee.description
    },
    {
      icon: Wallet,
      title: t.lowCommission.title,
      description: t.lowCommission.description
    },
    {
      icon: Globe,
      title: t.localization.title,
      description: t.localization.description
    }
  ];

  return (
    <section id="benefits" className="w-full bg-secondary/50 py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
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
