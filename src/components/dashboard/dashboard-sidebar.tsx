
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
import { Settings } from 'lucide-react';
import { Logo } from '../layout/logo';


export function DashboardSidebar({ userType }: { userType: 'freelancer' | 'client' }) {
    const pathname = usePathname();
    const navLinks = userType === 'freelancer' ? freelancerNavLinks : clientNavLinks;

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                     <Link
                        href="/dashboard"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base mb-2"
                        >
                        <span className="text-sm font-bold">IZ</span>
                        <span className="sr-only">IshTop.Uz</span>
                    </Link>
                    {navLinks.map((link) => (
                    <Tooltip key={link.href}>
                        <TooltipTrigger asChild>
                        <Link
                            href={link.href}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                { "bg-accent text-accent-foreground": pathname.startsWith(link.href) && link.href !== '/dashboard' },
                                { "bg-accent text-accent-foreground": pathname === '/dashboard' && link.href === '/dashboard' }
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
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                { "bg-accent text-accent-foreground": pathname.startsWith('/dashboard/settings') }
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
