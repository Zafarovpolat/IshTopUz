
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, Download } from "lucide-react"
import { EarningsChart } from "./earnings-chart"

const transactions = [
    { id: 't1', type: 'Поступление', date: '15.08.2024', amount: '+3,000,000 UZS', project: 'Разработка SMM-стратегии' },
    { id: 't2', type: 'Вывод', date: '10.08.2024', amount: '-5,000,000 UZS', project: 'На карту HUMO' },
    { id: 't3', type: 'Поступление', date: '02.08.2024', amount: '+2,500,000 UZS', project: 'Перевод документации' },
];

export function OverviewTab() {
  return (
    <div className="grid gap-6 mt-4">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">15,231,890 UZS</div>
                    <p className="text-xs text-muted-foreground">Доступно для вывода</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Заработано (за все время)</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45,850,000 UZS</div>
                    <p className="text-xs text-muted-foreground">На основе 15 завершенных проектов</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Статистика доходов</CardTitle>
                <CardDescription>Ваш заработок за последние 6 месяцев.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <EarningsChart />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Последние операции по вашему счету.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Тип</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead className="text-right">Сумма</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <Badge variant={transaction.type === 'Поступление' ? 'default' : 'secondary'}>
                                    {transaction.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{transaction.project}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className={`text-right font-semibold ${transaction.type === 'Поступление' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.amount}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
