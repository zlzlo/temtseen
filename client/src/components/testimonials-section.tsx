import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const content = translations.testimonials[language];

  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <Card key={`${testimonial.name}-${index}`}>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div
                    className={`w-12 h-12 ${
                      testimonial.color === "primary"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    } rounded-full flex items-center justify-center font-bold`}
                  >
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.program}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
