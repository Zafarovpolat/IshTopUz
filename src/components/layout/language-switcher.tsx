"use client";

import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/language-context';
import { Language } from '@/lib/i18n';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Globe } from 'lucide-react';

const languages: { code: Language, name: string, nativeName: string }[] = [
    { code: 'ru', name: 'RU', nativeName: 'Русский' },
    { code: 'en', name: 'EN', nativeName: 'English' },
    { code: 'uz', name: 'UZ', nativeName: 'O‘zbekcha' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{currentLanguage?.name}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            {languages.map((lang) => (
                <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer"
                >
                    {lang.nativeName}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
