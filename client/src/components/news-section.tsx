import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: "research-conference",
    date: "2025.02.15",
    title: "Эрдэм шинжилгээний хурал 2025",
    description: "Санхүү ба AI чиглэлийн илтгэлүүд, олон улсын судлаачдын оролцоотой...",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Эрдэм шинжилгээний хурлын танилцуулга"
  },
  {
    id: "open-house",
    date: "2025.02.20", 
    title: "Нээлттэй хаалганы өдөр",
    description: "Кампус танилцуулга, демо хичээл, зөвлөгөө авах боломжтой...",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Их сургуулийн нээлттэй хаалганы өдөр"
  },
  {
    id: "graduation",
    date: "2025.01.25",
    title: "2024-2025 оны төгсөлтийн ёслол", 
    description: "500 гаруй төгсөгч дипломоо гардуулж авлаа...",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Төгсөлтийн ёслол"
  }
];

export default function NewsSection() {
  return (
    <section id="news" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Мэдээ ба Үйл явдал
            </h2>
            <p className="text-lg text-muted-foreground">
              Сүүлийн үеийн мэдээ, үйл явдлууд
            </p>
          </div>
          <Button 
            className="hidden sm:block"
            data-testid="button-view-all-news"
          >
            Бүгдийг харах
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
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
                  Дэлгэрэнгүй унших
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button data-testid="button-view-all-news-mobile">
            Бүгдийг харах
          </Button>
        </div>
      </div>
    </section>
  );
}
