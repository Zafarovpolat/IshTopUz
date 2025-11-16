
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, User, TrendingUp, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const earningSteps = [
    { icon: User, title: "Создайте привлекательный профиль", description: "Заполните всю информацию, добавьте качественное фото и подробно опишите свои навыки." },
    { icon: Briefcase, title: "Оформите сильное портфолио", description: "Добавьте лучшие работы, опишите задачи и результаты. Это ваше главное доказательство экспертизы." },
    { icon: TrendingUp, title: "Ищите проекты и подавайте заявки", description: "Регулярно просматривайте ленту заказов, пишите персонализированные отклики и предлагайте решения." },
    { icon: TrendingUp, title: "Стройте репутацию", description: "Выполняйте работу качественно и в срок, чтобы получать положительные отзывы и высокий рейтинг." },
];

const promotionTips = [
    { title: "SEO-оптимизация профиля", description: "Используйте ключевые слова в заголовке и описании, чтобы клиенты легче находили вас." },
    { title: "Активность на платформе", description: "Чаще заходите, обновляйте статус доступности и быстро отвечайте на сообщения." },
    { title: "Качество выполнения работ", description: "Превосходите ожидания клиентов. Довольный клиент — это повторные заказы и хорошие отзывы." },
    { title: "Профессиональная коммуникация", description: "Будьте вежливы, задавайте уточняющие вопросы и держите клиента в курсе прогресса." },
];

const financialTips = [
    { icon: Banknote, title: "Ведение учета доходов", description: "Фиксируйте все поступления, чтобы контролировать свой заработок и планировать финансы." },
    { icon: Banknote, title: "Налогообложение", description: "Изучите налоговое законодательство для самозанятых в Узбекистане, чтобы легально вести деятельность." },
    { icon: Banknote, title: "Планирование бюджета", description: "Откладывайте часть дохода на налоги, развитие и непредвиденные расходы." },
];

export default function HowToEarnPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Как зарабатывать на IshTop.Uz</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Ваш путь к успешной фриланс-карьере в Узбекистане.</p>
                </div>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Руководство по заработку</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {earningSteps.map((step, index) => (
                             <Card key={index} className="flex items-start gap-4 p-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Советы по продвижению</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {promotionTips.map((tip, index) => (
                           <Card key={index} className="p-6">
                               <CardHeader className="p-0 mb-2">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                        <CardTitle className="text-xl">{tip.title}</CardTitle>
                                    </div>
                               </CardHeader>
                               <CardContent className="p-0">
                                   <p className="text-muted-foreground">{tip.description}</p>
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                </section>
                
                 <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Финансовая грамотность</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {financialTips.map((tip, index) => (
                            <Card key={index} className="text-center p-6 bg-secondary/50">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                                    <tip.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold">{tip.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Готовы начать?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                       Примените эти знания на практике. Найдите свой первый или следующий проект прямо сейчас.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/jobs">Найти работу</Link>
                    </Button>
                </section>
            </main>
            <Footer />
        </>
    );
}
