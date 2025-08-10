import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-background py-20 md:py-32">
       <div 
        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" 
        aria-hidden="true"
      ></div>
      <div className="container relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="text-center lg:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Freelance Market in <span className="text-primary">Uzbekistan</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Secure transactions, 5% commission, seamless payments via HUMO and Payme.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Button asChild size="lg" className="shadow-lg transition-transform hover:scale-105">
              <Link href="#contact">Sign Up for Beta Access</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-lg transition-transform hover:scale-105">
              <Link href="#benefits">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto h-full w-full max-w-lg lg:max-w-none">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Freelancer working on a laptop"
            width={600}
            height={400}
            className="rounded-3xl shadow-2xl"
            data-ai-hint="freelancer laptop"
          />
        </div>
      </div>
    </section>
  );
}
