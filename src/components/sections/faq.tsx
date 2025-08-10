import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
      question: "What is IshTop.Uz?",
      answer: "IshTop.Uz is the first freelance marketplace in Uzbekistan, designed to connect talented freelancers with clients for secure and efficient project collaboration.",
    },
    {
      question: "How does the payment guarantee work?",
      answer: "We use an escrow system. The client's payment is held securely in an account and is only released to the freelancer once the work is completed and approved by the client.",
    },
    {
        question: "What is the commission fee?",
        answer: "IshTop.Uz charges a flat 5% commission on all transactions, which is significantly lower than most other international platforms. This means more of your earnings stay with you."
    },
    {
      question: "Which payment methods are supported?",
      answer: "The platform will support popular local payment systems, including HUMO and Payme, for seamless and convenient transactions.",
    },
    {
      question: "When will the platform launch?",
      answer: "We are currently in the beta testing phase. Sign up for our newsletter to receive exclusive updates and be the first to know when we officially launch!",
    },
  ];
  
  export function Faq() {
    return (
      <section id="faq" className="w-full bg-background py-24 sm:py-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about IshTop.Uz.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i + 1}`}>
                  <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  }
  