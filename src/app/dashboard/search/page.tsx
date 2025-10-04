
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ListFilter, Search as SearchIcon, Star } from "lucide-react";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const freelancers = [
    {
        id: 1,
        name: 'Алиса Воронова',
        title: 'UI/UX Дизайнер, Графический дизайнер',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
        rating: 4.9,
        reviews: 24,
        hourlyRate: 150000,
        skills: ['Figma', 'UI/UX', 'Mobile Design', 'Web Design'],
        isTopRated: true,
    },
    {
        id: 2,
        name: 'Максим Петров',
        title: 'Full-stack Разработчик',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
        rating: 5.0,
        reviews: 18,
        hourlyRate: 250000,
        skills: ['React', 'Node.js', 'PostgreSQL', 'Next.js'],
        isTopRated: true,
    },
    {
        id: 3,
        name: 'Тимур Ибрагимов',
        title: 'Frontend Разработчик',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        rating: 4.8,
        reviews: 12,
        hourlyRate: 200000,
        skills: ['React', 'TypeScript', 'TailwindCSS'],
        isTopRated: false,
    },
     {
        id: 4,
        name: 'Елена Соколова',
        title: 'Копирайтер, SEO-специалист',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
        rating: 4.9,
        reviews: 35,
        hourlyRate: 80000,
        skills: ['Копирайтинг', 'SEO', 'Контент-маркетинг'],
        isTopRated: true,
    },
];


export default function SearchPage() {
  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Filters Sidebar */}
        <Card className="hidden md:block">
            <CardHeader>
                <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="keywords">Ключевые слова</Label>
                    <Input id="keywords" placeholder="Навык, имя, специальность..."/>
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
                    <Label>Рейтинг</Label>
                     <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
                        <span>4.5 и выше</span>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="rate">Часовая ставка (UZS)</Label>
                    <Slider defaultValue={[50000, 500000]} max={1000000} step={10000} min={0} />
                     <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>1,000,000+</span>
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
                    <Input placeholder="Поиск по навыкам, именам..." className="pl-8" />
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
                        <DropdownMenuRadioGroup value="relevance">
                            <DropdownMenuRadioItem value="relevance">Релевантности</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="top-rated">Топ исполнители</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="newest">Новые</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid gap-6">
                {freelancers.map(freelancer => (
                     <Card key={freelancer.id}>
                        <CardHeader className="grid grid-cols-[auto_1fr_auto] items-start gap-4 space-y-0">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                                <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {freelancer.name}
                                    {freelancer.isTopRated && <Badge>Top Rated</Badge>}
                                </CardTitle>
                                <CardDescription>{freelancer.title}</CardDescription>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground pt-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-foreground">{freelancer.rating}</span>
                                    <span>({freelancer.reviews} отзывов)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold">{freelancer.hourlyRate.toLocaleString()} UZS</p>
                                <p className="text-sm text-muted-foreground">/ час</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-wrap gap-2">
                                {freelancer.skills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                             </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button className="w-full">Пригласить</Button>
                            <Button variant="outline" className="w-full">Профиль</Button>
                        </CardFooter>
                     </Card>
                ))}
            </div>
        </main>
    </div>
  );
}
