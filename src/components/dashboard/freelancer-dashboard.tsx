import {
  Activity,
  ArrowUpRight,
  DollarSign,
  Users,
  CreditCard,
} from 'lucide-react';

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

type FreelancerDashboardProps = {
  userData: any;
  stats: any;
  recentProjects: any[];
  recommendedProjects: any[];
};

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
  open: { label: "Открыт", variant: "outline" },
  in_progress: { label: "В работе", variant: "default" },
  completed: { label: "Завершен", variant: "secondary" },
  closed: { label: "Закрыт", variant: "destructive" },
};

export function FreelancerDashboard({
  userData,
  stats,
  recentProjects,
  recommendedProjects
}: FreelancerDashboardProps) {

  // Безопасное получение данных со значениями по умолчанию
  const earnings = stats?.earnings || 0;
  const activeProjects = stats?.activeProjects || 0;
  const rating = stats?.rating || 0;
  const reviewsCount = stats?.reviewsCount || 0;
  const totalProposals = stats?.totalProposals || 0;
  const invitations = stats?.invitations || 0;

  return (
    <div className="grid gap-4 md:gap-8">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Текущий баланс
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings.toLocaleString('ru-RU')} UZS
            </div>
            <p className="text-xs text-muted-foreground">
              Доступно для вывода
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
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Проектов в работе
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rating > 0 ? `${rating.toFixed(1)}/5.0` : 'Нет отзывов'}
            </div>
            <p className="text-xs text-muted-foreground">
              {reviewsCount > 0 ? `на основе ${reviewsCount} отзывов` : 'Пока нет отзывов'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отправлено заявок</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals}</div>
            <p className="text-xs text-muted-foreground">
              {invitations > 0 ? `${invitations} приглашения` : 'Нет новых приглашений'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Проекты и рекомендации */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* Мои проекты */}
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
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  У вас пока нет активных проектов
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/jobs">Найти проект</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Проект</TableHead>
                    <TableHead className="hidden xl:table-column">Статус</TableHead>
                    <TableHead className="hidden xl:table-column">Заказчик</TableHead>
                    <TableHead className="text-right">Оплата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Link
                          href={`/marketplace/jobs/${project.id}`}
                          className="font-medium hover:underline"
                        >
                          {project.title}
                        </Link>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {project.skills.slice(0, 2).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        <Badge variant={statusMap[project.status]?.variant || "outline"}>
                          {statusMap[project.status]?.label || project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-column">
                        {project.clientName}
                      </TableCell>
                      <TableCell className="text-right">
                        {project.budgetAmount.toLocaleString('ru-RU')} UZS
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Рекомендованные проекты */}
        <Card>
          <CardHeader>
            <CardTitle>Новые проекты по вашей специализации</CardTitle>
            <CardDescription>
              {recommendedProjects.length > 0
                ? 'Подходящие для вас проекты, опубликованные недавно.'
                : 'Заполните навыки в профиле для получения рекомендаций.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {recommendedProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Нет рекомендованных проектов
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/dashboard/profile">Заполнить профиль</Link>
                </Button>
              </div>
            ) : (
              recommendedProjects.map((project) => (
                <div key={project.id} className="flex items-center gap-4">
                  <div className="grid gap-1 flex-1">
                    <Link
                      href={`/marketplace/jobs/${project.id}`}
                      className="text-sm font-medium leading-none hover:underline"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Бюджет: {project.budgetAmount.toLocaleString('ru-RU')} UZS
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Button size="sm" asChild>
                      <Link href={`/marketplace/jobs/${project.id}`}>
                        Подать заявку
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}