"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Logo = () => {
  return (
    <h1 className="text-2xl font-bold text-foreground">
      IshTop<span className="text-primary">.Uz</span>
    </h1>
  );
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: "Главная" },
    { href: '#benefits', label: "Почему IshTop.Uz" },
    { href: '#faq', label: "FAQ" },
    { href: '#contact', label: "Контакты" },
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-4 lg:px-8">
          <div className="flex items-center flex-1">
            <Link href="#home">
              <Logo />
            </Link>
          </div>
          <nav className="hidden items-center justify-center gap-6 lg:flex flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center justify-end gap-2 lg:flex flex-1">
              <Button variant="ghost" className="max-w-[120px]">{"Войти"}</Button>
              <Button asChild className="max-w-[150px]">
                  <Link href="#contact">{"Регистрация"}</Link>
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
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100" 
          aria-modal="true" 
          data-state={isMenuOpen ? 'open' : 'closed'}
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeMenu} />
          <nav className="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-lg px-6 py-3 transition-transform duration-300 ease-in-out data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0">
            <div className="flex items-center justify-between">
               <Link href="#home" onClick={closeMenu}>
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
                  href={link.href}
                  className="text-lg font-medium text-foreground"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              <div className='flex flex-col gap-4 mt-auto'>
                <Button asChild size="lg" variant="ghost" className="text-foreground hover:bg-foreground/10 hover:text-foreground text-base" onClick={closeMenu}>
                    <Link href="#">{"Войти"}</Link>
                </Button>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base" onClick={closeMenu}>
                    <Link href="#contact">{"Регистрация"}</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
