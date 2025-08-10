"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {

  return (
    <section 
      id="home" 
      className="relative flex items-center justify-center w-full min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-3.5rem)] bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('https://i.yapx.ru/aOTzC.jpg')"}}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {"Первая фриланс биржа в Узбекистане"}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            {"Забудьте о старых правилах. Вы можете нанимать лучших специалистов. Прямо сейчас. Прямо здесь."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="shadow-lg transition-transform hover:scale-105 text-base">
              <Link href="#contact">{"Начать"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
