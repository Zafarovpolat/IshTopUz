import { Benefits } from '@/components/sections/benefits';
import { ContactFormSection } from '@/components/sections/contact-form';
import { Cta } from '@/components/sections/cta';
import { Faq } from '@/components/sections/faq';
import { Hero } from '@/components/sections/hero';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Benefits />
      <Faq />
      <ContactFormSection />
      <Cta />
      <Footer />
    </>
  );
}