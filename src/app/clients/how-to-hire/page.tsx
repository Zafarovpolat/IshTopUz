
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const steps = [
    { title: "Регистрация и верификация", description: "Создайте аккаунт и подтвердите свою личность для безопасности." },
    { title: "Создание детального проекта", description: "Четко опишите задачу, цели и ожидания от результата." },
    { title: "Установка бюджета и сроков", description: "Определите бюджет (фиксированный или почасовой) и крайний срок." },
    { title: "Получение предложений", description: "Фрилансеры откликнутся на ваш проект со своими предложениями." },
    { title: "Выбор исполнителя", description: "Изучите профили, портфолио и отзывы, чтобы выбрать лучшего кандидата." },
    { title: "Контроль выполнения работы", description: "Общайтесь с фрилансером, отслеживайте прогресс и давайте обратную связь." },
    { title: "Приемка и оплата", description: "После успешного завершения подтвердите выполнение, и оплата будет переведена фрилансеру." },
];

const tips = [
    { title: "Формулируйте задачи четко", description: "Избегайте двусмысленности. Опишите, что именно нужно сделать." },
    { title: "Приложите примеры", description: "Референсы и примеры помогут фрилансеру лучше понять ваши ожидания." },
    { title: "Укажите конкретные требования", description: "Например, 'использовать шрифт Inter', 'адаптивность под мобильные устройства'." },
    { title: "Определите критерии приемки", description: "Как вы будете оценивать готовую работу? Укажите это заранее." },
];

export default function HowToHirePage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Как нанять фрилансера на IshTop.Uz</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Простой и безопасный способ найти идеального исполнителя для вашего проекта.</p>
                </div>

                <section id="steps" className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">7 простых шагов к успешному найму</h2>
                    <div className="grid gap-6">
                        {steps.map((step, index) => (
                             <Card key={index} className="flex items-start gap-4 p-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">{index + 1}</div>
                                <div>
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="tips" className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Советы по составлению идеального ТЗ</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tips.map((tip, index) => (
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
                
                <section id="security">
                     <h2 className="text-3xl font-semibold mb-8 text-center">Безопасность ваших сделок</h2>
                     <Card className="bg-secondary/50 p-8 text-center">
                        <h3 className="text-2xl font-bold text-primary mb-2">Эскроу-система</h3>
                        <p className="max-w-2xl mx-auto text-muted-foreground">
                            Мы гарантируем безопасность каждой сделки. Ваши деньги замораживаются на специальном счете и переводятся исполнителю только после того, как вы подтвердите, что работа выполнена качественно и в срок. Это защищает вас от недобросовестных фрилансеров и гарантирует возврат средств в случае проблем.
                        </p>
                     </Card>
                </section>
            </main>
            <Footer />
        </>
    );
}
