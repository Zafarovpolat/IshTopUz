import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-background py-24 sm:py-32 lg:py-40">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" 
        aria-hidden="true"
      ></div>
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            IshTop.Uz — Your Freelance Marketplace in Uzbekistan
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Secure transactions, 5% commission, seamless payments via HUMO and Payme.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-accent text-accent-foreground shadow-md transition-transform hover:scale-105 hover:bg-accent/90">
              <Link href="#contact">Sign Up for Beta Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
