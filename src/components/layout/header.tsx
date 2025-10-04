

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/', label: "Главная" },
    { href: '/marketplace', label: "Биржа" },
    { href: '/talents', label: "Найти фрилансера" },
    { href: '#faq', label: "FAQ" },
    { href: '/contacts', label: "Контакты" },
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getLinkHref = (href: string) => {
    if (href.startsWith('/')) return href;
    return isHomePage ? `#${href.replace('#', '')}` : `/#${href.replace('#', '')}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 sm:h-16 lg:h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-1">
            <Link href={getLinkHref('/')}>
              <Logo />
            </Link>
          </div>
          <nav className="hidden items-center justify-center gap-6 lg:flex flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={getLinkHref(link.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center justify-end gap-2 lg:flex flex-1">
              <Button asChild variant="ghost" className="max-w-[120px] text-base">
                  <Link href="/auth">{"Войти"}</Link>
              </Button>
              <Button asChild className="max-w-[150px] text-base">
                  <Link href="/auth">{"Регистрация"}</Link>
              </Button>
          </div>
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label={"Переключить меню"}>
              <span className="sr-only">{"Переключить меню"}</span>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        aria-modal="true"
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeMenu} />
        
        {/* Navigation Panel */}
        <nav className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-background/95 backdrop-blur-lg w-full max-w-sm p-6 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between">
             <Link href={getLinkHref('/')} onClick={closeMenu}>
                <Logo />
             </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu} aria-label={"Закрыть меню"}>
              <X className="h-6 w-6" />
              <span className="sr-only">{"Закрыть меню"}</span>
            </Button>
          </div>
          <div className="flex flex-col gap-6 text-center self-center max-w-[360px] m-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={getLinkHref(link.href)}
                className="text-lg font-medium text-foreground"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className='flex flex-col gap-4 mt-8'>
              <Button asChild size="lg" variant="ghost" className="text-foreground hover:bg-foreground/10 hover:text-foreground text-base" onClick={closeMenu}>
                  <Link href="/auth">{"Войти"}</Link>
              </Button>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base" onClick={closeMenu}>
                  <Link href="/auth">{"Регистрация"}</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
