
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

// NOTE: This component currently uses static data.
// It needs to be connected to Firestore to fetch real user data.

export function ClientDashboard() {
  return (
    <div className="grid gap-4 md:gap-8">
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего потрачено
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231,890 UZS</div>
            <p className="text-xs text-muted-foreground">
              +20.1% с прошлого месяца
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные проекты
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              +3 с прошлой недели
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нанято фрилансеров</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +2 с прошлого месяца
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе сейчас</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2</div>
            <p className="text-xs text-muted-foreground">
              1 проект на стадии ревью
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Проекты</CardTitle>
              <CardDescription>
                Недавние проекты, которые вы создали.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/projects">
                Все проекты
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Статус
                  </TableHead>
                  <TableHead className="hidden xl:table-column">
                    Исполнитель
                  </TableHead>
                  <TableHead className="text-right">Бюджет</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Разработка логотипа</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Дизайн
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      В работе
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Алиса В.
                  </TableCell>
                  <TableCell className="text-right">2,500,000 UZS</TableCell>
                </TableRow>
                <TableRow>
                   <TableCell>
                    <div className="font-medium">Лендинг для кофейни</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Веб-разработка
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                     <Badge className="text-xs" variant="secondary">
                      Завершен
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Максим П.
                  </TableCell>
                  <TableCell className="text-right">5,000,000 UZS</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle>Рекомендованные фрилансеры</CardTitle>
             <CardDescription>Основано на ваших предыдущих проектах.</CardDescription>
           </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" />
                <AvatarFallback>ОМ</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Ольга Михайлова</p>
                <p className="text-sm text-muted-foreground">
                  UI/UX Дизайнер
                </p>
              </div>
              <div className="ml-auto font-medium">
                  <Button size="sm">Профиль</Button>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Avatar" />
                <AvatarFallback>ТИ</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Тимур Ибрагимов</p>
                <p className="text-sm text-muted-foreground">
                  Frontend Разработчик
                </p>
              </div>
              <div className="ml-auto font-medium">
                  <Button size="sm">Профиль</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    