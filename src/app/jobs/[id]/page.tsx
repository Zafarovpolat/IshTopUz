
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { File, MapPin, Verified, Briefcase, DollarSign, Clock, Star, Paperclip, Send } from 'lucide-react';
import { getUserId } from '@/lib/get-user-data';
import Link from 'next/link';

// Mock data, in a real app this would be fetched from DB
const project = {
    id: 1,
    title: 'Разработать логотип для IT-компании',
    budget: 'До 3,000,000 UZS',
    posted: '2 часа назад',
    description: "Нам нужен современный и минималистичный логотип для нашей новой IT-компании 'Innovatech'. Мы занимаемся разработкой облачных решений. Логотип должен отражать инновационность, надежность и технологичность. Предпочтительные цвета: синий, серый, белый. Необходимо предоставить несколько вариантов и исходники в векторном формате.",
    skills: ['Логотип', 'Брендинг', 'Adobe Illustrator', 'Графический дизайн'],
    files: [{ name: 'Бриф_Innovatech.pdf', size: '2.4 MB' }],
    proposalsCount: 5,
    client: {
        name: 'Innovatech Solutions',
        location: 'Ташкент, Узбекистан',
        isVerified: true,
        projectsPosted: 12,
        memberSince: '2023 г.'
    }
};

const proposals = [
    { id: 1, name: 'Алиса В.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', rating: 4.9, bid: '2,800,000 UZS', coverLetter: 'Здравствуйте! Опыт в брендинге 5+ лет. Готова приступить немедленно.'},
    { id: 2, name: 'Сергей Г.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', rating: 4.7, bid: '3,000,000 UZS', coverLetter: 'Добрый день. В портфолио есть похожие проекты для IT-сферы. Сделаю 5 вариантов.'},
]


export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const userId = await getUserId();

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <Badge variant="outline" className="w-fit mb-2">Опубликован {project.posted}</Badge>
                                <CardTitle className="text-3xl">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{project.description}</p>
                                <Separator className="my-6" />
                                <h3 className="font-semibold mb-3">Необходимые навыки</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                                <Separator className="my-6" />
                                <h3 className="font-semibold mb-3">Прикрепленные файлы</h3>
                                <div className="space-y-2">
                                    {project.files.map(file => (
                                        <div key={file.name} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <File className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{file.size}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">Скачать</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Proposals Section */}
                        <div id="proposals">
                            <h2 className="text-2xl font-bold mb-4">Предложения ({project.proposalsCount})</h2>
                            <div className="space-y-6">
                                {proposals.map(p => (
                                    <Card key={p.id}>
                                        <CardHeader className="flex flex-row justify-between">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={p.avatar} alt={p.name} />
                                                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{p.name}</p>
                                                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{p.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{p.bid}</p>
                                                <p className="text-xs text-muted-foreground">Ставка</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground italic border-l-2 pl-3">"{p.coverLetter}"</p>
                                        </CardContent>
                                        {userId && (
                                            <CardFooter className="gap-2">
                                                <Button size="sm">Нанять</Button>
                                                <Button size="sm" variant="outline">Сообщение</Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>

                         {/* Submit Proposal Section */}
                        {userId ? (
                             <Card id="submit-proposal">
                                <CardHeader>
                                    <CardTitle>Подать предложение</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="bid-amount">Ваша ставка (UZS)</Label>
                                            <Input id="bid-amount" type="number" placeholder="3000000" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bid-duration">Срок выполнения (дни)</Label>
                                            <Input id="bid-duration" type="number" placeholder="5" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cover-letter">Сопроводительное письмо</Label>
                                        <Textarea id="cover-letter" placeholder="Расскажите, почему именно вы подходите для этого проекта..." rows={5} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="attachments">Прикрепить файлы</Label>
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="attachments" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Paperclip className="w-8 h-8 mb-3 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Нажмите для загрузки</span> или перетащите</p>
                                                </div>
                                                <Input id="attachments" type="file" className="hidden" />
                                            </label>
                                        </div> 
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button size="lg"><Send className="mr-2 h-4 w-4" /> Отправить предложение</Button>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card className="text-center p-8">
                                <CardTitle>Хотите выполнить этот проект?</CardTitle>
                                <CardDescription className="mt-2">Войдите в свой аккаунт или зарегистрируйтесь, чтобы подать предложение.</CardDescription>
                                <Button asChild size="lg" className="mt-6">
                                    <Link href="/auth">Войти и подать заявку</Link>
                                </Button>
                            </Card>
                        )}
                    </div>
                    {/* Sidebar */}
                    <div className="space-y-6 lg:sticky lg:top-24 self-start">
                        <Card>
                            <CardHeader>
                                <CardTitle>О заказчике</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-2 font-semibold text-lg">
                                    <Avatar className="h-8 w-8">
                                        {/* You can use a real avatar if available */}
                                        <AvatarFallback>{project.client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {project.client.name}
                                </div>
                                 <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{project.client.location}</span>
                                </div>
                                {project.client.isVerified && (
                                    <div className="flex items-center gap-2 text-green-600 font-medium">
                                        <Verified className="h-4 w-4" />
                                        <span>Верифицированный клиент</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.client.projectsPosted} проектов опубликовано</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>На сайте с {project.client.memberSince}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>Информация о проекте</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-semibold">{project.budget}</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <span>Проект</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
