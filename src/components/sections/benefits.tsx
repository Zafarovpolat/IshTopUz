import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Lock, Wallet } from 'lucide-react';

const benefits = [
  {
    icon: Lock,
    title: "Payment Guarantee",
    description: "Escrow accounts for secure transactions, ensuring your funds are safe until the work is approved."
  },
  {
    icon: Wallet,
    title: "Low Commission",
    description: "We charge only 5%, significantly lower than the 10-20% on other platforms. More earnings for you."
  },
  {
    icon: Globe,
    title: "Localization",
    description: "A platform built for Uzbekistan, with support for Uzbek, Russian, and English, plus seamless Telegram integration."
  }
];

export function Benefits() {
  return (
    <section id="benefits" className="w-full bg-primary/5 py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">Why Choose IshTop.Uz?</h2>
          <p className="mt-4 text-lg text-muted-foreground">The best features for freelancers and clients in Uzbekistan.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="flex flex-col items-center p-8 text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <benefit.icon className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CardTitle className="mb-2 text-xl font-semibold">{benefit.title}</CardTitle>
                <CardDescription className="text-base">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
