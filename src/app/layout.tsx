import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
