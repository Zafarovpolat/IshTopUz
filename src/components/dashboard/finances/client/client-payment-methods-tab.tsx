
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Trash2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const paymentMethods = [
    { id: 'w1', type: 'HUMO', details: '**** 9860', isPrimary: true },
    { id: 'w2', type: 'Uzcard', details: '**** 8600', isPrimary: false },
];

export function ClientPaymentMethodsTab() {
  return (
    <div className="grid gap-6 mt-4">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Способы оплаты</CardTitle>
                        <CardDescription>Управляйте вашими банковскими картами для пополнения баланса.</CardDescription>
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                           <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Добавить карту
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Новая карта</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Тип</Label>
                                     <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Выберите тип" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="humo">HUMO</SelectItem>
                                            <SelectItem value="uzcard">Uzcard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="card-number" className="text-right">Номер карты</Label>
                                    <Input id="card-number" placeholder="9860 **** **** ****" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="expiry-date" className="text-right">Срок действия</Label>
                                    <Input id="expiry-date" placeholder="ММ/ГГ" className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="submit">Добавить</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                                <CreditCardIcon type={method.type} />
                                <div>
                                    <p className="font-semibold">{method.type}</p>
                                    <p className="text-sm text-muted-foreground">{method.details}</p>
                                </div>
                                 {method.isPrimary && <Badge>Основной</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                                {!method.isPrimary && <Button variant="ghost" size="sm">Сделать основной</Button>}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        У вас нет добавленных способов оплаты.
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

function CreditCardIcon({ type }: { type: string }) {
    if (type === 'HUMO') {
        return <div className="rounded-md bg-blue-100 p-2 text-blue-600 font-bold">HUMO</div>
    }
    if (type === 'Uzcard') {
         return <div className="rounded-md bg-green-100 p-2 text-green-600 font-bold">Uzcard</div>
    }
    return <div className="rounded-md bg-gray-100 p-2 text-gray-600">CARD</div>
}
