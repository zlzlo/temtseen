import { CheckCircle, Eye, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Бидний тухай
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              1992 оноос эхтэй уламжлалт сургалтын арга зүйг дижитал шилжилттэй хослуулж, хөдөлмөрийн зах зээлд бэлэн, ёс зүйтэй, бүтээлч мэргэжилтэн бэлтгэнэ.
            </p>
            <div className="flex items-center text-primary font-semibold">
              <span>30+ жилийн туршлага</span>
              <span className="mx-4">•</span>
              <span>5000+ төгсөгч</span>
            </div>
          </div>
          <div>
            <img
              src="https://pixabay.com/get/g47b8881a41e33f23759fbefd12f1bde190091c32b7b2338a0a5077002520b601e31edc8e67d007e38aadac2d08bf83b82aff743531d9583325fa696e38639e7d_1280.jpg"
              alt="Их сургуулийн кампус"
              className="rounded-xl shadow-lg w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Mission, Vision, Values Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">
                Эрхэм зорилго
              </h3>
              <p className="text-muted-foreground">
                Чанартай боловсролоор нийгмийн хөгжилд хувь нэмэр оруулах.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">
                Алсын хараа
              </h3>
              <p className="text-muted-foreground">
                Судалгаа, инновацаар тэргүүлсэн их сургууль.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-card-foreground">
                Үнэт зүйлс
              </h3>
              <p className="text-muted-foreground">
                Оюунлаг байдал • Шударга ёс • Хамтын хөгжил.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
