import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

const Logo = () => (
    <h1 className="text-2xl font-bold text-foreground">
        IshTop<span className="text-primary">.Uz</span>
    </h1>
);

export function Footer() {
  return (
    <footer className="w-full bg-secondary/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start gap-4">
                <Logo />
                <p className="max-w-sm text-sm text-muted-foreground">
                Uzbekistan’s first freelance marketplace designed for secure and efficient collaboration.
                </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
                <div>
                    <h3 className="font-semibold text-foreground">For Clients</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">How to Hire</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Talent Marketplace</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Project Catalog</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Hire in UZ</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">For Freelancers</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">How to Earn</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Find Work</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Connect with Clients</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Company</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                        <li><Link href="https://t.me/IshTopUz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            <Send className="h-4 w-4" /> Telegram
                            </Link>
                        </li>
                        <li><Link href="mailto:info@ishtop.uz" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            <Mail className="h-4 w-4" /> Email
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IshTop.Uz — All Rights Reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
