import {
    LayoutDashboard,
    User,
    Briefcase,
    Wallet,
    MessageSquare,
    Star,
    Search,
    FilePlus2
} from 'lucide-react';

export const freelancerNavLinks = [
    { href: '/dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Мой профиль', icon: User },
    { href: '/dashboard/projects', label: 'Мои проекты', icon: Briefcase },
    { href: '/dashboard/offers', label: 'Предложения', icon: FilePlus2 },
    { href: '/dashboard/finances', label: 'Финансы', icon: Wallet },
];

export const clientNavLinks = [
    { href: '/dashboard', label: 'Панель управления', icon: LayoutDashboard },
    { href: '/dashboard/projects', label: 'Мои проекты', icon: Briefcase },
    { href: '/dashboard/search', label: 'Поиск исполнителей', icon: Search },
    { href: '/dashboard/offers', label: 'Предложения', icon: FilePlus2 },
    { href: '/dashboard/finances', label: 'Финансы', icon: Wallet },
];
