import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-gradient min-h-screen flex items-center">
      <div className="container mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Ирээдүйгээ Мандах-аас эхлүүлье.
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed">
          Мандах Их Сургууль — санхүү, мэдээллийн технологи, бизнесийн чиглэлийн чанартай боловсролыг олон улсын стандарттай уялдуулан олгоно.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => scrollToSection("#admissions")}
            className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors inline-flex items-center text-lg"
            data-testid="button-admissions"
          >
            Элсэлтийн мэдээлэл
            <ArrowDown className="w-5 h-5 ml-2" />
          </Button>
          <Button
            onClick={() => scrollToSection("#programs")}
            variant="outline"
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-lg"
            data-testid="button-programs"
          >
            Хөтөлбөрүүдийг үзэх
          </Button>
        </div>
      </div>
    </section>
  );
}
