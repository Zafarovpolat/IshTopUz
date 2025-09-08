import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'IshTop.Uz — Ваша фриланс-биржа в Узбекистане',
  description: 'Безопасные сделки, комиссия 5%, удобные платежи через HUMO и Payme. Присоединяйтесь к бета-тестированию первой фриланс-биржи в Узбекистане.',
  openGraph: {
    title: 'IshTop.Uz — Ваша фриланс-биржа в Узбекистане',
    description: 'Присоединяйтесь к бета-тестированию первой фриланс-биржи в Узбекистане.',
    url: 'https://ishtop.uz',
    siteName: 'IshTop.Uz',
    images: [
      {
        url: 'https://i.yapx.ru/aOXky.png',
        width: 1200,
        height: 630,
        alt: 'IshTop.Uz - Фриланс-биржа в Узбекистане',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IshTop.Uz — Ваша фриланс-биржа в Узбекистане',
    description: 'Безопасные сделки, комиссия 5%, удобные платежи через HUMO и Payme.',
    images: ['https://i.yapx.ru/aOXky.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
