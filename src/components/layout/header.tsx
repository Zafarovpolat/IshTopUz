"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Logo = () => (
  <h1 className="text-2xl font-bold text-foreground">
    IshTop<span className="text-primary">.Uz</span>
  </h1>
);

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#benefits', label: 'Why IshTop.Uz' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost">Log In</Button>
            <Button asChild>
                <Link href="#contact">Sign Up</Link>
            </Button>
        </div>
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            <span className="sr-only">Toggle menu</span>
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
              <Button variant="ghost" size="icon" onClick={closeMenu} aria-label="Close menu">
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
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
              <div className='flex flex-col gap-4 mt-4'>
                <Button asChild size="lg" variant="ghost" onClick={closeMenu}>
                    <Link href="#">Log In</Link>
                </Button>
                <Button asChild size="lg" onClick={closeMenu}>
                    <Link href="#contact">Sign Up</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
