
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Shield, File, Video, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const communicationTips = [
    { title: "Правила первого контакта", description: "Будьте вежливы, представьтесь и покажите, что вы внимательно прочитали описание проекта." },
    { title: "Задавайте правильные вопросы", description: "Уточните все детали, которые помогут вам лучше понять задачу и избежать недопонимания." },
    { title: "Презентуйте свои идеи", description: "Не просто говорите, что сделаете работу, а предложите свое видение и пути решения." },
    { title: "Работайте с возражениями", description: "Спокойно и аргументированно отвечайте на сомнения клиента, демонстрируя свой профессионализм." },
];

const tools = [
    { icon: MessageSquare, name: "Встроенный чат", description: "Для быстрого обмена сообщениями и обсуждения рабочих моментов." },
    { icon: Send, name: "Telegram-интеграция", description: "Получайте уведомления и отвечайте на сообщения прямо в Telegram." },
    { icon: Video, name: "Видеозвонки", description: "Проводите видеовстречи для детального обсуждения сложных задач (в разработке)." },
    { icon: File, name: "Обмен файлами", description: "Безопасно обменивайтесь макетами, документами и другими материалами." },
];

const conflictResolution = [
    { icon: Shield, title: "Как избежать недопонимания", description: "Фиксируйте все договоренности в чате, составляйте краткое резюме после звонков." },
    { icon: Users, title: "Работа с претензиями", description: "Если клиент недоволен, сохраняйте спокойствие, выслушайте его и предложите варианты решения." },
    { icon: Shield, title: "Медиация споров", description: "В случае серьезных разногласий наша служба поддержки поможет найти компромиссное решение." },
];

export default function ClientCommunicationPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Эффективное общение с клиентами</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Ключ к успешным проектам и долгосрочному сотрудничеству.</p>
                </div>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Основные принципы</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {communicationTips.map((tip, index) => (
                           <Card key={index} className="p-6">
                               <CardHeader className="p-0 mb-3">
                                   <CardTitle className="text-xl">{tip.title}</CardTitle>
                               </CardHeader>
                               <CardContent className="p-0">
                                   <p className="text-muted-foreground">{tip.description}</p>
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Инструменты коммуникации</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tools.map((tool, index) => (
                            <Card key={index} className="text-center p-6">
                                <div className="mb-4 inline-block">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <tool.icon className="h-8 w-8" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>
                
                <section>
                     <h2 className="text-3xl font-semibold mb-8 text-center">Разрешение конфликтов</h2>
                     <div className="space-y-6">
                        {conflictResolution.map((item, index) => (
                            <Card key={index} className="flex items-start gap-4 p-6">
                               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-foreground flex-shrink-0">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </Card>
                        ))}
                     </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
