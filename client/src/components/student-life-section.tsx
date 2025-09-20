import { Users, DollarSign, Building, Book, Zap, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const facilities = [
  {
    title: "Клуб, клубууд",
    description: "Спорт, урлаг, шинжлэх ухааны 20 гаруй клуб",
    icon: Users,
    color: "primary"
  },
  {
    title: "Тэтгэлэг", 
    description: "Гүйцэтгэл, нийгмийн байдлаар олгогддог тэтгэлэг",
    icon: DollarSign,
    color: "accent"
  },
  {
    title: "Дотуур байр",
    description: "Орчин үеийн дотуур байр, тав тухтай орчин", 
    icon: Building,
    color: "primary"
  },
  {
    title: "Номын сан",
    description: "100,000 гаруй ном, цахим нөөц, суралцах орчин",
    icon: Book,
    color: "accent"
  },
  {
    title: "Инновацын лаборатори",
    description: "Орчин үеийн тоног төхөөрөмж, практик сургалт",
    icon: Zap,
    color: "primary"
  },
  {
    title: "Спортын заал", 
    description: "Орчин үеийн спортын байгууламж, фитнесс төв",
    icon: Trophy,
    color: "accent"
  }
];

export default function StudentLifeSection() {
  return (
    <section id="student-life" className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Оюутны амьдрал
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Клуб, клубууд; тэтгэлэг; дотуур байр; номын сан; спортын заал; инновацын лаборатори—оюутны хөгжлийг бүх талаар дэмжинэ.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <Card key={index} className="card-hover text-center">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${
                  facility.color === "primary" ? "bg-primary" : "bg-accent"
                } rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <facility.icon className={`w-8 h-8 ${
                    facility.color === "primary" ? "text-primary-foreground" : "text-accent-foreground"
                  }`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {facility.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {facility.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
