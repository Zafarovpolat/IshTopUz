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

type ClientDashboardProps = {
  userData: any;
  stats: any;
  recentProjects: any[];
};

const statusMap: { [key: string]: { label: string; variant: "default" | "secondary" | "outline" | "destructive" } } = {
  open: { label: "Открыт", variant: "outline" },
  in_progress: { label: "В работе", variant: "default" },
  completed: { label: "Завершен", variant: "secondary" },
  closed: { label: "Закрыт", variant: "destructive" },
};

export function ClientDashboard({ userData, stats, recentProjects }: ClientDashboardProps) {
  // Безопасное получение данных
  const moneySpent = stats?.moneySpent || 0;
  const activeProjects = stats?.activeProjects || 0;
  const openProjects = stats?.openProjects || 0;
  const completedProjects = stats?.completedProjects || 0;
  const hiredFreelancers = stats?.hiredFreelancers || 0;
  const totalProposalsReceived = stats?.totalProposalsReceived || 0;

  return (
    <div className="grid gap-4 md:gap-8">
      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего потрачено
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moneySpent.toLocaleString('ru-RU')} UZS
            </div>
            <p className="text-xs text-muted-foreground">
              На основе завершенных проектов
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
              {openProjects > 0 ? `${openProjects} открытых проектов` : 'Нет открытых проектов'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нанято фрилансеров</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hiredFreelancers}</div>
            <p className="text-xs text-muted-foreground">
              {completedProjects > 0
                ? `${completedProjects} завершенных проектов`
                : 'Нет завершенных проектов'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Получено откликов</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposalsReceived}</div>
            <p className="text-xs text-muted-foreground">
              На все ваши проекты
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Проекты */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {/* Мои проекты */}
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
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  У вас пока нет проектов
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/dashboard/projects">Создать проект</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead className="hidden xl:table-column">Статус</TableHead>
                    <TableHead className="hidden xl:table-column">Исполнитель</TableHead>
                    <TableHead className="text-right">Бюджет</TableHead>
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
                        {project.freelancerName || (
                          <span className="text-muted-foreground">
                            {project.proposalsCount > 0
                              ? `${project.proposalsCount} откликов`
                              : 'Нет откликов'}
                          </span>
                        )}
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

        {/* Активность */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Управление вашими проектами</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/projects">
                Создать новый проект
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/offers">
                Просмотреть отклики ({totalProposalsReceived})
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/talents">
                Найти фрилансеров
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}