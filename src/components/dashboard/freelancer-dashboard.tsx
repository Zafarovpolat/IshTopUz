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

export function FreelancerDashboard() {
  return (
    <div className="grid gap-4 md:gap-8">
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Заработано в этом месяце
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,231,890 UZS</div>
            <p className="text-xs text-muted-foreground">
              +180.1% с прошлого месяца
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
            <div className="text-2xl font-bold">+3</div>
            <p className="text-xs text-muted-foreground">
              +1 с прошлой недели
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5.0</div>
            <p className="text-xs text-muted-foreground">
              на основе 24 отзывов
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Новых предложений</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              2 приглашения в проекты
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Мои проекты</CardTitle>
              <CardDescription>
                Ваши недавние активные проекты.
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
                  <TableHead>Проект</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Статус
                  </TableHead>
                  <TableHead className="hidden xl:table-column">
                    Заказчик
                  </TableHead>
                  <TableHead className="text-right">Оплата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Разработка SMM-стратегии</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      SMM
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs" variant="outline">
                      В работе
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    ООО "Рога и Копыта"
                  </TableCell>
                  <TableCell className="text-right">3,000,000 UZS</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Перевод документации</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Перевод
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                     <Badge className="text-xs" variant="secondary">
                      Завершен
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Иван Петров
                  </TableCell>
                  <TableCell className="text-right">1,500,000 UZS</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle>Новые проекты по вашей специализации</CardTitle>
              <CardDescription>Подходящие для вас проекты, опубликованные недавно.</CardDescription>
           </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Нужен копирайтер для блога</p>
                <p className="text-sm text-muted-foreground">
                  Бюджет: 2,000,000 UZS
                </p>
              </div>
              <div className="ml-auto font-medium">
                  <Button size="sm">Подать заявку</Button>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Создать 10 креативов для Instagram</p>
                <p className="text-sm text-muted-foreground">
                  Бюджет: 1,800,000 UZS
                </p>
              </div>
              <div className="ml-auto font-medium">
                  <Button size="sm">Подать заявку</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
