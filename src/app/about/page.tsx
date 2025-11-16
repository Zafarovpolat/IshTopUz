
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const teamMembers = [
    { name: "Джавохир", role: "Основатель и CEO", avatar: placeholderImages.about.team1.src, hint: placeholderImages.about.team1.hint },
    { name: "Алиса", role: "Руководитель разработки", avatar: placeholderImages.about.team2.src, hint: placeholderImages.about.team2.hint },
    { name: "Максим", role: "Директор по маркетингу", avatar: placeholderImages.about.team3.src, hint: placeholderImages.about.team3.hint },
];

const partners = [
    { name: "IT-Park Uzbekistan", logo: placeholderImages.about.partner1.src, hint: placeholderImages.about.partner1.hint },
    { name: "Payme", logo: placeholderImages.about.partner2.src, hint: placeholderImages.about.partner2.hint },
    { name: "HUMO", logo: placeholderImages.about.partner3.src, hint: placeholderImages.about.partner3.hint },
];

export default function AboutPage() {
    return (
        <>
            <Header />
            <main>
                <section className="bg-secondary/50 py-20 text-center">
                    <div className="container mx-auto max-w-4xl px-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Наша миссия — создать <span className="text-primary">прозрачный</span> и <span className="text-primary">эффективный</span> рынок фриланса в Узбекистане.</h1>
                        <p className="mt-6 text-lg text-muted-foreground">Мы верим в талантливых специалистов нашей страны и стремимся предоставить им лучшие инструменты для роста и заработка.</p>
                    </div>
                </section>

                 <section className="py-16 sm:py-24">
                    <div className="container mx-auto max-w-5xl px-4">
                         <div className="grid md:grid-cols-2 gap-12 items-center">
                             <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
                                 <Image 
                                    src={placeholderImages.about.history.src} 
                                    alt="История создания IshTop.Uz" 
                                    layout="fill" 
                                    objectFit="cover"
                                    data-ai-hint={placeholderImages.about.history.hint} 
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Наша история</h2>
                                <p className="text-muted-foreground mb-4">
                                    IshTop.Uz родился из простого наблюдения: талантливые специалисты в Узбекистане сталкиваются с высокими комиссиями на международных платформах и отсутствием удобных локальных решений.
                                </p>
                                <p className="text-muted-foreground">
                                    Мы решили это изменить. Наша цель — создать платформу, которая устраняет эти барьеры, предлагая низкую комиссию в 5%, безопасные сделки через эскроу и интеграцию с местными платежными системами. Мы начали с идеи, провели десятки интервью с фрилансерами и клиентами, и теперь строим продукт, который, как мы верим, изменит правила игры.
                                </p>
                            </div>
                         </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24 bg-secondary/50">
                    <div className="container mx-auto max-w-5xl px-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight mb-12">Наша команда</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {teamMembers.map(member => (
                                <div key={member.name} className="flex flex-col items-center">
                                    <Avatar className="h-32 w-32 mb-4">
                                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.hint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-xl font-semibold">{member.name}</h3>
                                    <p className="text-muted-foreground">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24">
                     <div className="container mx-auto max-w-5xl px-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight mb-12">Партнеры и инвесторы</h2>
                        <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
                            {partners.map(partner => (
                                <div key={partner.name} className="relative h-16 w-40 grayscale hover:grayscale-0 transition-all">
                                     <Image 
                                        src={partner.logo} 
                                        alt={partner.name} 
                                        layout="fill" 
                                        objectFit="contain"
                                        data-ai-hint={partner.hint}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                 <section className="bg-primary text-primary-foreground py-16 text-center">
                    <div className="container mx-auto max-w-4xl px-4">
                        <h2 className="text-3xl font-bold tracking-tight">Присоединяйтесь к нам</h2>
                        <p className="mt-4 text-lg text-primary-foreground/80">
                            Ищете новые возможности или хотите стать частью нашей команды?
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Button asChild size="lg" variant="secondary">
                                <Link href="/jobs">Искать работу</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                <Link href="/contacts">Связаться с нами</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
