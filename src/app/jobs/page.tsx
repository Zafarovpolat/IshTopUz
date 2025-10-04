
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ListFilter, Search as SearchIcon, Verified, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

const jobs = [
    {
        id: 1,
        title: 'Разработать логотип для IT-компании',
        budget: 'До 3,000,000 UZS',
        skills: ['Логотип', 'Брендинг', 'Adobe Illustrator'],
        posted: '2 часа назад',
        proposals: 5,
        clientVerified: true,
    },
    {
        id: 2,
        title: 'Нужен копирайтер для ведения блога о путешествиях',
        budget: '150,000 UZS за статью',
        skills: ['Копирайтинг', 'SEO', 'Путешествия'],
        posted: '1 день назад',
        proposals: 12,
        clientVerified: true,
    },
    {
        id: 3,
        title: 'Создать анимационный ролик для рекламы',
        budget: 'Бюджет по договоренности',
        skills: ['After Effects', 'Анимация', 'Motion Design'],
        posted: '3 дня назад',
        proposals: 8,
        clientVerified: false,
    },
];


export default function JobsPage() {
  return (
    <>
    <Header />
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Поиск работы</h1>
            <p className="mt-4 text-lg text-muted-foreground">Найдите лучшие проекты и откликнитесь на них первыми.</p>
        </div>
        <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Filters Sidebar */}
            <Card className="hidden md:block sticky top-20">
                <CardHeader>
                    <CardTitle>Фильтры</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="keywords">Ключевые слова</Label>
                        <Input id="keywords" placeholder="React, Дизайн, Копирайтинг..."/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Категория</Label>
                        <Select>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Все категории" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="development">Разработка</SelectItem>
                                <SelectItem value="design">Дизайн</SelectItem>
                                <SelectItem value="copywriting">Копирайтинг</SelectItem>
                                <SelectItem value="smm">SMM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Бюджет (UZS)</Label>
                        <Slider defaultValue={[500000, 5000000]} max={10000000} step={100000} min={0} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0</span>
                            <span>10,000,000+</span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="verified-client" />
                            <label
                                htmlFor="verified-client"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Только проверенные заказчики
                            </label>
                        </div>
                    </div>
                    <Button className="w-full">Применить</Button>
                </CardContent>
            </Card>

            {/* Main Content */}
            <main>
                <div className="flex items-center justify-between mb-4">
                    <div className="relative w-full max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Поиск по названию или описанию..." className="pl-8" />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto h-8 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Сортировать
                            </span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value="newest">
                                <DropdownMenuRadioItem value="newest">Сначала новые</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="budget-desc">Бюджет (по убыванию)</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="budget-asc">Бюджет (по возрастанию)</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="grid gap-6">
                    {jobs.map(job => (
                        <Card key={job.id}>
                           <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg hover:text-primary transition-colors">
                                        <Link href="#">{job.title}</Link>
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <Bookmark className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription className="flex items-center gap-4 pt-1">
                                    <span>{job.budget}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span>{job.posted}</span>
                                     {job.clientVerified && (
                                        <>
                                         <span className="text-muted-foreground">•</span>
                                         <span className="flex items-center gap-1 text-sm text-green-600">
                                            <Verified className="h-4 w-4" /> Заказчик проверен
                                         </span>
                                        </>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                               <Button>Подать заявку</Button>
                               <span className="text-sm text-muted-foreground">Откликов: {job.proposals}</span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    </div>
    <Footer />
    </>
  );
}
