

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import placeholderImages from '@/lib/placeholder-images.json';
import { getUserId } from "@/lib/get-user-data";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const kworks = [
    {
        id: 1,
        title: "Разработаю 3 варианта логотипа за 2 дня",
        category: "Дизайн",
        price: "1,000,000 UZS",
        author: "Алиса Воронова",
        authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
        rating: 4.9,
        reviews: 15,
        image: placeholderImages.projects.kwork1.src,
        imageHint: placeholderImages.projects.kwork1.hint,
    },
    {
        id: 2,
        title: "Создам лендинг на Tilda за 3 дня",
        category: "Веб-разработка",
        price: "2,500,000 UZS",
        author: "Максим Петров",
        authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
        rating: 5.0,
        reviews: 22,
        image: placeholderImages.projects.kwork2.src,
        imageHint: placeholderImages.projects.kwork2.hint,
    },
    {
        id: 3,
        title: "Напишу 5 продающих SEO-статей для вашего блога",
        category: "Копирайтинг",
        price: "800,000 UZS",
        author: "Елена Соколова",
        authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
        rating: 4.9,
        reviews: 35,
        image: placeholderImages.projects.kwork3.src,
        imageHint: placeholderImages.projects.kwork3.hint,
    },
];

const categories = ["Веб-разработка", "Мобильные приложения", "Дизайн", "Копирайтинг", "Переводы", "Маркетинг", "Видео/Аудио"];

export async function KworksCatalog() {
    const userId = await getUserId();
    const orderLink = userId ? `/projects/${kworks[0].id}` : '/auth';

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="cursor-pointer text-base py-1">Все</Badge>
                    {categories.map(cat => (
                            <Badge key={cat} variant="outline" className="cursor-pointer text-base py-1">{cat}</Badge>
                    ))}
                </div>
                    <Select>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Сортировать по..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="popularity">Популярности</SelectItem>
                        <SelectItem value="newest">Новизне</SelectItem>
                        <SelectItem value="price-asc">Цене (по возрастанию)</SelectItem>
                            <SelectItem value="price-desc">Цене (по убыванию)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kworks.map(kwork => (
                    <Card key={kwork.id} className="overflow-hidden group flex flex-col">
                        <Link href={orderLink} className="flex flex-col flex-grow">
                            <div className="relative h-48 w-full">
                                <Image 
                                    src={kwork.image} 
                                    alt={kwork.title} 
                                    layout="fill" 
                                    objectFit="cover" 
                                    className="transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={kwork.imageHint}
                                />
                                <Badge className="absolute top-2 right-2">{kwork.category}</Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg leading-tight h-14 group-hover:text-primary transition-colors">{kwork.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Image src={kwork.authorAvatar} alt={kwork.author} width={24} height={24} className="rounded-full" />
                                        <span className="text-sm font-medium">{kwork.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold">{kwork.rating}</span>
                                        <span className="text-sm text-muted-foreground">({kwork.reviews})</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="w-full flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">от</p>
                                    <p className="text-lg font-bold">{kwork.price}</p>
                                </div>
                            </CardFooter>
                        </Link>
                    </Card>
                ))}
            </div>
        </>
    )
}


export default function ProjectsCatalogPage() {
    return (
        <>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Каталог Проектов</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Готовые решения от лучших фрилансеров с фиксированной ценой.</p>
                </div>
                <KworksCatalog />
            </main>
            <Footer />
        </>
    );
}
