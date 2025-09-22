import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function PartnershipsSection() {
  const partnerPlaceholders = Array(6).fill(null);
  const { language } = useLanguage();
  const content = translations.partnerships[language];

  return (
    <section id="partnerships" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {partnerPlaceholders.map((_, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl shadow-lg flex items-center justify-center h-24 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-8 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
