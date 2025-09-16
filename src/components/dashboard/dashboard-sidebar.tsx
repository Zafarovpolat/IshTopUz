'use client';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { clientNavLinks, freelancerNavLinks } from '@/lib/dashboard-nav';
import { Home, Settings } from 'lucide-react';


export function DashboardSidebar({ userType }: { userType: 'freelancer' | 'client' }) {
    const pathname = usePathname();
    const navLinks = userType === 'freelancer' ? freelancerNavLinks : clientNavLinks;

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Link
                            href="/"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Home className="h-5 w-5" />
                            <span className="sr-only">На главную</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">На главную</TooltipContent>
                    </Tooltip>
                    {navLinks.map((link) => (
                    <Tooltip key={link.href}>
                        <TooltipTrigger asChild>
                        <Link
                            href={link.href}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                { "bg-accent text-accent-foreground": pathname === link.href }
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            <span className="sr-only">{link.label}</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{link.label}</TooltipContent>
                    </Tooltip>
                    ))}
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                        href="/dashboard/settings"
                        className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                            { "bg-accent text-accent-foreground": pathname === "/dashboard/settings" }
                        )}
                        >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Настройки</span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Настройки</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    );
}
