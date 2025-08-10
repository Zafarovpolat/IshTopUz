import { Benefits } from '@/components/sections/benefits';
import { ContactFormSection } from '@/components/sections/contact-form';
import { Cta } from '@/components/sections/cta';
import { Hero } from '@/components/sections/hero';

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <ContactFormSection />
      <Cta />
    </>
  );
}
