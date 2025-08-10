import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Cta() {
  return (
    <section className="w-full bg-primary/5 py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to start your freelance journey?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Join IshTop.Uz! Sign up for beta testing and start earning or finding top talent in Uzbekistan.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="shadow-md transition-transform hover:scale-105">
              <Link href="#contact">Join Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
