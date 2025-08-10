"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';
  
export function Faq() {
    const { language } = useContext(LanguageContext);
    const t = translations[language].faq;

    const faqs = [
        {
          question: t.q1,
          answer: t.a1,
        },
        {
          question: t.q2,
          answer: t.a2,
        },
        {
            question: t.q3,
            answer: t.a3,
        },
        {
          question: t.q4,
          answer: t.a4,
        },
        {
          question: t.q5,
          answer: t.a5,
        },
      ];

    return (
      <section id="faq" className="w-full bg-background py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i + 1}`}>
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  }
  