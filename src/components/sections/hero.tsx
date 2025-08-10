"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';

export function Hero() {
  const { language } = useContext(LanguageContext);
  const t = translations[language].hero;

  return (
    <section id="home" className="w-full bg-background pt-12 pb-20 md:pt-24 md:pb-32">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t.subtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button asChild size="lg" className="shadow-sm">
              <Link href="#contact">{t.getStarted}</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto h-full w-full max-w-lg lg:max-w-none">
          <Image
            src="https://placehold.co/600x600.png"
            alt={t.imageAlt}
            width={600}
            height={600}
            className="rounded-full shadow-2xl"
            data-ai-hint="freelancer computer"
          />
        </div>
      </div>
    </section>
  );
}
