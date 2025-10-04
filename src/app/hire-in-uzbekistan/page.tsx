
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, TrendingUp, Languages, Globe } from 'lucide-react';
import Image from 'next/image';

const advantages = [
    { icon: Users, title: "Качественные специалисты", description: "Доступ к пулу талантливых и мотивированных профессионалов в различных областях." },
    { icon: TrendingUp, title: "Доступные цены", description: "Конкурентоспособные расценки на услуги, позволяющие оптимизировать бюджеты проектов." },
    { icon: Globe, title: "Знание местного рынка", description: "Эксперты, глубоко понимающие культурные и экономические особенности Узбекистана." },
    { icon: Languages, title: "Языковые преимущества", description: "Свободное владение русским и узбекским языками, а также хороший уровень английского." },
];

const stats = [
    { label: "Разработчиков", value: "5,000+" },
    { label: "Дизайнеров", value: "3,500+" },
    { label: "Маркетологов", value: "2,000+" },
];

export default function HireInUzbekistanPage() {
    return (
        <>
            <Header />
            <main>
                <section className="relative bg-cover bg-center py-20 text-white" style={{ backgroundImage: "url('/images/tashkent.jpg')" }}>
                    <div className="absolute inset-0 bg-primary/80" />
                    <div className="relative container mx-auto max-w-5xl px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Нанимайте таланты в Узбекистане</h1>
                        <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">Откройте для своего бизнеса мир возможностей, работая с лучшими фрилансерами из сердца Центральной Азии.</p>
                        <Button asChild size="lg" className="mt-8 bg-background text-foreground hover:bg-background/90">
                            <Link href="/talents">Найти исполнителя</Link>
                        </Button>
                    </div>
                </section>

                 <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Преимущества найма в Узбекистане</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {advantages.map((advantage, index) => (
                                <Card key={index} className="text-center p-6">
                                    <div className="mb-4 inline-block">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <advantage.icon className="h-8 w-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                                    <p className="text-muted-foreground">{advantage.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-24 bg-secondary/50">
                    <div className="container mx-auto max-w-5xl px-4">
                         <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Растущий рынок талантов</h2>
                                <p className="text-muted-foreground mb-8">
                                    Рынок фриланса в Узбекистане стремительно развивается. С каждым годом растет число квалифицированных специалистов, готовых предложить свои услуги на международном уровне. Средние ставки остаются привлекательными по сравнению с мировыми, не уступая в качестве.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {stats.map(stat => (
                                        <div key={stat.label} className="bg-background rounded-lg p-4 text-center border">
                                            <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                                 <Image src="/images/office.jpg" alt="Uzbekistan professionals" layout="fill" objectFit="cover" />
                            </div>
                         </div>
                    </div>
                </section>

                 <section className="py-16 sm:py-24 bg-background">
                    <div className="container mx-auto max-w-5xl px-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight mb-4">Начните работать с нами</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                           IshTop.Uz предоставляет удобные инструменты для поиска, найма и управления проектами с участием специалистов из Узбекистана. Безопасные сделки, прозрачные условия и поддержка на каждом этапе.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/projects/create">Опубликовать проект</Link>
                        </Button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
