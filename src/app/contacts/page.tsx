
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Bot } from 'lucide-react';
import Link from 'next/link';

const contactInfo = [
    { icon: MapPin, title: "Адрес", value: "г. Ташкент, ул. Истиклол, 2", href: "#" },
    { icon: Phone, title: "Телефон", value: "+998 71 200 00 00", href: "tel:+998712000000" },
    { icon: Mail, title: "Email", value: "info@ishtop.uz", href: "mailto:info@ishtop.uz" },
];

const supportChannels = [
    { icon: Bot, title: "Telegram-бот поддержки", description: "Мгновенные ответы на частые вопросы.", buttonText: "Перейти в бот" },
    { icon: Mail, title: "Система тикетов", description: "Для сложных технических вопросов.", buttonText: "Создать тикет" },
];

export default function ContactsPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Свяжитесь с нами</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Мы всегда готовы помочь и ответить на ваши вопросы.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Side: Contact Info & Support */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Контактная информация</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((item) => (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <item.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                                                {item.value}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Техническая поддержка</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {supportChannels.map((channel) => (
                                    <div key={channel.title} className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-start gap-4">
                                            <channel.icon className="h-8 w-8 text-primary flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold">{channel.title}</h3>
                                                <p className="text-sm text-muted-foreground">{channel.description}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">{channel.buttonText}</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Форма обратной связи</CardTitle>
                                <CardDescription>Задайте нам вопрос или оставьте предложение.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ваше имя</Label>
                                        <Input id="name" placeholder="Иван Иванов" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="you@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Тема</Label>
                                        <Input id="subject" placeholder="Предложение по улучшению" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Сообщение</Label>
                                        <Textarea id="message" placeholder="Ваше сообщение..." rows={5} />
                                    </div>
                                    <Button type="submit" className="w-full">Отправить</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
