"use client";

import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageContext } from '@/context/language-context';
import { Language } from '@/lib/i18n';

const languages: { code: Language, name: string }[] = [
    { code: 'ru', name: 'RU' },
    { code: 'en', name: 'EN' },
    { code: 'uz', name: 'UZ' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className="flex items-center gap-1 rounded-full border bg-background p-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'secondary' : 'ghost'}
          size="sm"
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            language === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          }`}
          onClick={() => setLanguage(lang.code)}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
