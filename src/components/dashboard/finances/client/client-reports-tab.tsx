
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "../date-picker-with-range"
import { FileText, Download } from "lucide-react"

const generatedReports = [
    { id: 'r1', name: 'Счет-фактура #1024', period: '01.07.2024 - 31.07.2024', generatedDate: '01.08.2024' },
    { id: 'r2', name: 'Акт выполненных работ #1023', period: '01.06.2024 - 30.06.2024', generatedDate: '01.07.2024' },
];

export function ClientReportsTab() {
  return (
    <div className="grid gap-6 mt-4">
        <Card>
            <CardHeader>
                <CardTitle>Сформировать документ</CardTitle>
                <CardDescription>Выберите период для генерации счета или акта выполненных работ.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start gap-4">
                <DatePickerWithRange />
                <div className="flex gap-2">
                    <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Счет-фактура
                    </Button>
                     <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Акт
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Готовые документы</CardTitle>
                <CardDescription>Здесь хранятся ранее сгенерированные вами документы.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {generatedReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-semibold">{report.name}</p>
                            <p className="text-sm text-muted-foreground">Период: {report.period}</p>
                            <p className="text-xs text-muted-foreground">Дата формирования: {report.generatedDate}</p>
                        </div>
                        <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Скачать</span>
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
