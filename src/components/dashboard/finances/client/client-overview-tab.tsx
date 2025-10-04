
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
import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, ShieldCheck, PlusCircle } from "lucide-react"

const transactions = [
    { id: 't1', type: 'Оплата', date: '15.08.2024', amount: '-2,500,000 UZS', project: 'Разработка логотипа' },
    { id: 't2', type: 'Пополнение', date: '14.08.2024', amount: '+5,000,000 UZS', project: 'С карты HUMO **** 1234' },
    { id: 't3', type: 'Возврат', date: '10.08.2024', amount: '+1,000,000 UZS', project: 'Отмена доп. правок по проекту "Лендинг"' },
];

export function ClientOverviewTab() {
  return (
    <div className="grid gap-6 mt-4">
        <div className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Текущий баланс</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2,500,000 UZS</div>
                    <Button size="sm" className="mt-2 w-full">
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Пополнить
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Средств в эскроу</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">7,500,000 UZS</div>
                    <p className="text-xs text-muted-foreground">Заморожено по 2 активным проектам</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего потрачено</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45,231,890 UZS</div>
                    <p className="text-xs text-muted-foreground">На основе 12 завершенных проектов</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>История платежей</CardTitle>
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
                                <Badge variant={
                                    transaction.type === 'Пополнение' ? 'default' :
                                    transaction.type === 'Возврат' ? 'secondary' : 'outline'
                                }>
                                    {transaction.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{transaction.project}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell className={`text-right font-semibold ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
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
