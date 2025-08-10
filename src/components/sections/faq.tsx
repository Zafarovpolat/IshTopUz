"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
export function Faq() {

    const faqs = [
        {
          question: "Что такое IshTop.Uz?",
          answer: "IshTop.Uz — это первая фриланс-биржа в Узбекистане, созданная для объединения талантливых фрилансеров и заказчиков для безопасной и эффективной работы над проектами.",
        },
        {
          question: "Как работает гарантия оплаты?",
          answer: "Мы используем систему escrow. Оплата заказчика надежно хранится на специальном счете и переводится фрилансеру только после того, как работа будет выполнена и одобрена заказчиком.",
        },
        {
            question: "Какая комиссия на платформе?",
            answer: "IshTop.Uz взимает фиксированную комиссию 5% со всех транзакций. Это значительно ниже, чем на других международных площадках, что позволяет вам зарабатывать больше.",
        },
        {
          question: "Какие способы оплаты поддерживаются?",
          answer: "Платформа поддерживает популярные в Узбекистане платежные системы, включая HUMO и Payme, для максимального удобства.",
        },
        {
          question: "Когда платформа будет запущена?",
          answer: "Сейчас мы на этапе бета-тестирования. Подпишитесь на нашу рассылку, чтобы первыми получать новости и узнать о официальном запуске!",
        },
      ];

    return (
      <section id="faq" className="w-full bg-background py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">FAQ</h2>
                <p className="mt-4 text-base text-muted-foreground sm:text-lg">{"Здесь вы найдете ответы на популярные вопросы о IshTop.Uz."}</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i + 1}`}>
                  <AccordionTrigger className="text-left text-base sm:text-lg font-medium hover:no-underline">
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
  