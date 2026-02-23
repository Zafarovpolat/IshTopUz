// src/components/dashboard/dashboard-header.tsx
"use client";
import Link from "next/link";
import { Menu, MessageSquare, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { doSignOut } from "@/lib/auth";
import type { User } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "./notification-bell";
import { freelancerNavLinks, clientNavLinks } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function DashboardHeader({ user }: { user: User | any }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Определяем навигацию по типу пользователя
  const navLinks =
    user.userType === "freelancer" ? freelancerNavLinks : clientNavLinks;

  const handleSignOut = async () => {
    await doSignOut();
    window.location.href = "/";
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const displayName = user.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : user.email;
  const fallbackName = user.profile?.firstName
    ? getInitials(`${user.profile.firstName} ${user.profile.lastName}`)
    : getInitials(user.email || "");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* Мобильное меню */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Открыть меню</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  IZ
                </span>
                <span>IshTop.Uz</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 mt-6 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === link.href ||
                    (pathname.startsWith(link.href) &&
                      link.href !== "/dashboard")
                    ? "bg-muted text-primary"
                    : "text-muted-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                pathname.startsWith("/dashboard/settings")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Settings className="h-5 w-5" />
              Настройки
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* Поиск */}
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/dashboard/messages">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Сообщения</span>
          </Link>
        </Button>
        <NotificationBell userId={user.uid} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage
                  src={user.profile?.avatar || user.photoURL}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback>{fallbackName}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Мой профиль</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Настройки</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/finances">Финансы</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive"
            >
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
