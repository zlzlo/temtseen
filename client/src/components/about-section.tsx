import { CheckCircle, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const icons = [CheckCircle, Eye, Heart];
const iconBackgrounds = ["bg-primary", "bg-accent", "bg-secondary"] as const;
const iconColors = ["text-primary-foreground", "text-accent-foreground", "text-primary"] as const;

export default function AboutSection() {
  const { language } = useLanguage();
  const content = translations.about[language];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {content.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {content.description}
            </p>
            <div className="flex items-center text-primary font-semibold">
              {content.stats.map((stat, index) => (
                <div key={stat} className="flex items-center">
                  <span>{stat}</span>
                  {index < content.stats.length - 1 && <span className="mx-4">•</span>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://pixabay.com/get/g47b8881a41e33f23759fbefd12f1bde190091c32b7b2338a0a5077002520b601e31edc8e67d007e38aadc2d08bf83b82aff743531d9583325fa696e38639e7d_1280.jpg"
              alt={content.imageAlt}
              className="rounded-xl shadow-lg w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.cards.map((card, index) => {
            const Icon = icons[index];
            const background = iconBackgrounds[index];
            const iconColor = iconColors[index];

            return (
              <Card key={card.title} className="card-hover">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${background} rounded-lg flex items-center justify-center mb-4`}>
                    {Icon && <Icon className={`w-6 h-6 ${iconColor}`} />}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
