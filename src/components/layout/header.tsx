"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Logo = () => (
  <h1 className="text-2xl font-bold">
    <span className="text-primary">IshTop</span>
    <span className="text-accent">.Uz</span>
  </h1>
);

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#benefits', label: 'Features' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#home" onClick={closeMenu}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
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
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild>
            <Link href="#contact">Join Now</Link>
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
              <Button asChild size="lg" className="mt-4" onClick={closeMenu}>
                <Link href="#contact">Join Now</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
