import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Сургалтын төлбөрийг хэрхэн төлөх вэ?",
    answer: "Капитал банкны гүйлгээ, картаар болон цахимаар хуваан төлөх боломжтой."
  },
  {
    question: "Тэтгэлэгт хөтөлбөр байдаг уу?",
    answer: "Гүйцэтгэл, нийгмийн идэвх, тусгай шаардлагаар зарлагддаг."
  },
  {
    question: "Дотуур байранд байрлах боломжтой юу?",
    answer: "Тийм ээ, орчин үеийн дотуур байр байгаа бөгөөд хүсэлт гаргаж болно."
  },
  {
    question: "Гадаад улсын оюутан элсэх боломжтой юу?", 
    answer: "Тийм ээ, олон улсын оюутнуудыг хүлээн авдаг. Тусгай шаардлага хангах шаардлагатай."
  },
  {
    question: "Ажилд ороход туслалцаа үзүүлдэг үү?",
    answer: "Карьер хөгжлийн алба тусгайлан байгуулагдаж, ажлын байртай холбож өгдөг."
  },
  {
    question: "Онлайн сургалт явуулдаг уу?",
    answer: "Гибрид хэлбэрээр онлайн болон танхимын сургалтыг хослуулан явуулдаг."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Түгээмэл асуулт
          </h2>
          <p className="text-lg text-muted-foreground">
            Их асуугддаг асуултууд болон хариултууд
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
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
