"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {

  return (
    <section 
      id="home" 
      className="relative flex items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}
      data-ai-hint="office background"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {"Работа, как она должна быть"}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {"Забудьте о старых правилах. Вы можете нанимать лучших специалистов. Прямо сейчас. Прямо здесь."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="shadow-lg transition-transform hover:scale-105">
              <Link href="#contact">{"Начать"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
