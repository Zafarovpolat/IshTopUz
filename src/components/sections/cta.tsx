"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Cta() {

  return (
    <section className="w-full bg-primary text-primary-foreground py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {"Готовы начать свой путь во фрилансе?"}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
            {"Присоединяйтесь к IshTop.Uz! Запишитесь на бета-тестирование, чтобы начать зарабатывать или находить лучших исполнителей в Узбекистане."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" variant="secondary" className="shadow-md transition-transform hover:scale-105">
              <Link href="#contact">{"Зарегистрироваться"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
