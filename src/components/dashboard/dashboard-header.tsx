
'use client';
import Link from 'next/link';
import {
  Bell,
  Home,
  MessageSquare,
  Package2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { doSignOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '../layout/logo';

export function DashboardHeader({ user }: { user: User | any }) {
    const router = useRouter();

    const handleSignOut = async () => {
        await doSignOut();
        // Перезагружаем страницу, чтобы убедиться, что все состояния сброшены
        // и middleware корректно отработает редирект.
        window.location.href = '/';
    };
    
    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    const displayName = user.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : user.email;
    const fallbackName = user.profile?.firstName ? getInitials(`${user.profile.firstName} ${user.profile.lastName}`) : getInitials(user.email || '');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto">
         <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/dashboard/messages">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Сообщения</span>
            </Link>
         </Button>
         <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Уведомления</span>
         </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                 <AvatarImage src={user.profile?.avatar || user.photoURL} alt={displayName} className="object-cover" />
                 <AvatarFallback>{fallbackName}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/settings">Настройки</Link></DropdownMenuItem>
            <DropdownMenuItem>Поддержка</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Выйти</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
