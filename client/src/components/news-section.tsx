import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function NewsSection() {
  const { language } = useLanguage();
  const content = translations.news[language];

  return (
    <section id="news" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {content.description}
            </p>
          </div>
          <Button
            className="hidden sm:block"
            data-testid="button-view-all-news"
          >
            {content.viewAll}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((item) => (
            <Card key={item.id} className="overflow-hidden card-hover">
              <div>
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-accent font-medium mb-2">
                  {item.date}
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {item.description}
                </p>
                <button
                  className="text-primary font-medium text-sm hover:underline"
                  data-testid={`button-news-${item.id}`}
                >
                  {content.readMore}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button data-testid="button-view-all-news-mobile">
            {content.viewAll}
          </Button>
        </div>
      </div>
    </section>
  );
}
