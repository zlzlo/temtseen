import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function FaqSection() {
  const { language } = useLanguage();
  const content = translations.faq[language];

  return (
    <section id="faq" className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {content.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="bg-card rounded-xl shadow-lg px-6"
              >
                <AccordionTrigger
                  className="font-semibold text-card-foreground hover:text-primary transition-colors"
                  data-testid={`faq-question-${index}`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
