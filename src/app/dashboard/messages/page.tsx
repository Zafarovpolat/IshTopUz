
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Search, Send, Paperclip } from "lucide-react";

const conversations = [
    { id: 1, name: 'Алиса В.', lastMessage: 'Хорошо, жду макеты к вечеру. Это очень длинное сообщение, чтобы проверить, как работает перенос строки и усечение текста.', time: '10:42', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', unread: 0, online: true },
    { id: 2, name: 'Максим П.', lastMessage: 'Проект завершен. Спасибо за работу!', time: 'Вчера', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', unread: 0, online: false },
    { id: 3, name: 'ООО "Рога и Копыта"', lastMessage: 'Уточните, пожалуйста, стоимость правок.', time: '2д', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c', unread: 2, online: true },
    { id: 4, name: 'Иван Петров', lastMessage: 'Все отлично, спасибо!', time: '5д', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', unread: 0, online: false },
];

const messages = [
    { id: 1, sender: 'Алиса В.', text: 'Здравствуйте! Обсудим проект по разработке логотипа?', time: '10:30', self: false },
    { id: 2, sender: 'You', text: 'Здравствуйте, Алиса! Да, конечно. Какие у вас есть идеи?', time: '10:31', self: true },
    { id: 3, sender: 'Алиса В.', text: 'Хочется что-то минималистичное, в зеленых тонах. Наша кофейня называется "Green Leaf".', time: '10:35', self: false },
    { id: 4, sender: 'Алиса В.', text: 'Хорошо, жду макеты к вечеру.', time: '10:42', self: false },
];


export default function MessagesPage() {
    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))]">
            {/* Sidebar with conversations */}
            <div className="w-full md:w-[350px] flex-shrink-0 flex flex-col border-r">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold">Сообщения</h1>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Поиск по чатам..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {conversations.map((convo) => (
                             <button
                                key={convo.id}
                                className={cn(
                                    "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left",
                                    convo.id === 1 && "bg-muted" // Highlight the selected chat
                                )}
                            >
                                <Avatar className="relative h-10 w-10">
                                    <AvatarImage src={convo.avatar} alt={convo.name} />
                                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                    {convo.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{convo.name}</p>
                                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                </div>
                                <div className="flex flex-col items-end text-xs text-muted-foreground">
                                    <span>{convo.time}</span>
                                    {convo.unread > 0 && (
                                        <div className="mt-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs">
                                            {convo.unread}
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main chat window */}
            <main className="flex-1 flex flex-col">
                <header className="flex items-center gap-4 p-4 border-b">
                     <Avatar className="relative h-10 w-10">
                        <AvatarImage src={conversations[0].avatar} alt={conversations[0].name} />
                        <AvatarFallback>{conversations[0].name.charAt(0)}</AvatarFallback>
                        {conversations[0].online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                    </Avatar>
                    <div>
                        <p className="font-semibold">{conversations[0].name}</p>
                        <p className="text-sm text-muted-foreground">{conversations[0].online ? 'В сети' : 'Не в сети'}</p>
                    </div>
                </header>
                
                <ScrollArea className="flex-1 p-4 bg-muted/20">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex items-end gap-2 max-w-[75%]",
                                    msg.self ? "self-end flex-row-reverse" : "self-start"
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                     <AvatarImage src={msg.self ? 'https://i.pravatar.cc/150?u=me' : conversations[0].avatar} />
                                     <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "rounded-lg px-4 py-2 text-sm",
                                        msg.self
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-background border rounded-bl-none"
                                    )}
                                >
                                    <p>{msg.text}</p>
                                    <p className={cn("text-xs mt-1", msg.self ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                
                <footer className="p-4 border-t">
                    <div className="relative">
                        <Input placeholder="Напишите сообщение..." className="pr-24" />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
