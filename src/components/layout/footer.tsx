import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

const Logo = () => (
  <h1 className="text-2xl font-bold">
    <span className="text-primary">IshTop</span>
    <span className="text-accent">.Uz</span>
  </h1>
);

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Logo />
            <p className="max-w-sm text-center text-sm text-muted-foreground md:text-left">
              Uzbekistan’s first freelance marketplace designed for secure and efficient collaboration.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://t.me/IshTopUz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
              <Send className="h-6 w-6" />
              <span className="sr-only">Telegram</span>
            </Link>
            <Link href="mailto:info@ishtop.uz" className="text-muted-foreground transition-colors hover:text-foreground">
              <Mail className="h-6 w-6" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IshTop.Uz — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
