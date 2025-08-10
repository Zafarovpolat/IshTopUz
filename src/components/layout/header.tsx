"use client";

import { useState, useContext } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';
import LanguageSwitcher from './language-switcher';

const Logo = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language].header;

  return (
    <h1 className="text-2xl font-bold text-foreground">
      IshTop<span className="text-primary">.Uz</span>
    </h1>
  );
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useContext(LanguageContext);
  const t = translations[language].header;

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#benefits', label: t.nav.why },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact },
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#home" onClick={closeMenu}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <Button variant="ghost">{t.login}</Button>
            <Button asChild>
                <Link href="#contact">{t.signup}</Link>
            </Button>
        </div>
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label={t.toggleMenu}>
            <span className="sr-only">{t.toggleMenu}</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
           <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={closeMenu}></div>
          <nav className="fixed right-0 top-0 z-50 flex h-full w-4/5 max-w-sm flex-col bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
               <Link href="#home" onClick={closeMenu}>
                  <Logo />
               </Link>
              <Button variant="ghost" size="icon" onClick={closeMenu} aria-label={t.closeMenu}>
                <X className="h-6 w-6" />
                <span className="sr-only">{t.closeMenu}</span>
              </Button>
            </div>
            <div className="mt-8 flex flex-col gap-6">
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
               <div className='flex justify-center my-4'>
                <LanguageSwitcher />
              </div>
              <div className='flex flex-col gap-4 mt-4'>
                <Button asChild size="lg" variant="ghost" onClick={closeMenu}>
                    <Link href="#">{t.login}</Link>
                </Button>
                <Button asChild size="lg" onClick={closeMenu}>
                    <Link href="#contact">{t.signup}</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
