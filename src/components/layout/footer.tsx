"use client";

import { Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {

  return (
    <footer className="w-full bg-secondary/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start gap-4">
                <Logo />
                <p className="max-w-sm text-sm text-muted-foreground">
                {"Первая в Узбекистане фриланс-биржа для безопасного и эффективного сотрудничества."}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
                <div>
                    <h3 className="font-semibold text-foreground">{"Заказчикам"}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Как нанять"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Биржа талантов"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Каталог проектов"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Нанять в UZ"}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{"Фрилансерам"}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Как заработать"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Найти работу"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Связаться с клиентами"}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{"Компания"}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"О нас"}</Link></li>
                        <li><Link href="/404" className="text-muted-foreground hover:text-primary">{"Контакты"}</Link></li>
                        <li><Link href="https://t.me/ishtopuzofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Send className="h-4 w-4" /> Telegram
                            </Link>
                        </li>
                        <li><Link href="mailto:info@ishtop.uz" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Mail className="h-4 w-4" /> Email
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IshTop.Uz — {"Все права защищены."}</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/terms-of-use" className="hover:text-primary">{"Условия использования"}</Link>
            <Link href="/privacy-policy" className="hover:text-primary">{"Политика конфиденциальности"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
