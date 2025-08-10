"use client";

import { Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';
import { translations } from '@/lib/i18n';

const Logo = () => (
    <h1 className="text-2xl font-bold text-foreground">
        IshTop<span className="text-primary">.Uz</span>
    </h1>
);

export function Footer() {
  const { language } = useContext(LanguageContext);
  const t = translations[language].footer;

  return (
    <footer className="w-full bg-secondary/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start gap-4">
                <Logo />
                <p className="max-w-sm text-sm text-muted-foreground">
                {t.description}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
                <div>
                    <h3 className="font-semibold text-foreground">{t.forClients.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forClients.howToHire}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forClients.talentMarketplace}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forClients.projectCatalog}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forClients.hireInUz}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{t.forFreelancers.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forFreelancers.howToEarn}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forFreelancers.findWork}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.forFreelancers.connect}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">{t.company.title}</h3>
                    <ul className="mt-4 space-y-2 text-sm">
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.company.about}</Link></li>
                        <li><Link href="#" className="text-muted-foreground hover:text-primary">{t.company.contact}</Link></li>
                        <li><Link href="https://t.me/IshTopUz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Send className="h-4 w-4" /> Telegram
                            </Link>
                        </li>
                        <li><Link href="mailto:info@ishtop.uz" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Mail className="h-4 w-4" /> Email
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IshTop.Uz — {t.rights}</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary">{t.terms}</Link>
            <Link href="#" className="hover:text-primary">{t.privacy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
