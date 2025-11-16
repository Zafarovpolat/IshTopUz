
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, BookmarkX } from "lucide-react";

const savedFreelancers = [
    {
        id: 1,
        name: 'Максим Петров',
        title: 'Full-stack Разработчик',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
        rating: 5.0,
        reviews: 18,
        hourlyRate: 250000,
        isTopRated: true,
    },
    {
        id: 2,
        name: 'Елена Соколова',
        title: 'Копирайтер, SEO-специалист',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
        rating: 4.9,
        reviews: 35,
        hourlyRate: 80000,
        isTopRated: true,
    },
];

export function SavedFreelancersTab() {
    if (savedFreelancers.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-12 text-center mt-4">
                <h3 className="text-xl font-semibold tracking-tight">Нет избранных исполнителей</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Вы можете сохранять профили фрилансеров, чтобы вернуться к ним позже.
                </p>
            </div>
        )
    }
  return (
    <div className="grid gap-6 mt-4">
      {savedFreelancers.map((freelancer) => (
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
            <CardFooter className="flex gap-2 justify-between">
                <Button>Пригласить в проект</Button>
                <div className="flex gap-2">
                    <Button variant="outline">Профиль</Button>
                     <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <BookmarkX className="h-5 w-5" />
                        <span className="sr-only">Удалить из избранного</span>
                    </Button>
                </div>
            </CardFooter>
         </Card>
      ))}
    </div>
  );
}
