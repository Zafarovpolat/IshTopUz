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
  title: 'IshTop.Uz — Your Freelance Marketplace in Uzbekistan',
  description: 'Secure transactions, 5% commission, seamless payments via HUMO and Payme. Join the beta for Uzbekistan\'s first freelance marketplace.',
  openGraph: {
    title: 'IshTop.Uz — Your Freelance Marketplace in Uzbekistan',
    description: 'Join the beta for Uzbekistan\'s first freelance marketplace.',
    url: 'https://ishtop.uz',
    siteName: 'IshTop.Uz',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'IshTop.Uz - Freelance Marketplace in Uzbekistan',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IshTop.Uz — Your Freelance Marketplace in Uzbekistan',
    description: 'Secure transactions, 5% commission, seamless payments via HUMO and Payme.',
    images: ['https://placehold.co/1200x630.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
