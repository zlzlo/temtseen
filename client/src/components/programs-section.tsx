import { DollarSign, Cpu, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const programs = [
  {
    id: "finance",
    title: "Санхүүгийн менежмент",
    level: "Бакалавр",
    duration: "4 жил • Өдрийн",
    skills: [
      "Санхүүгийн шинжилгээ",
      "Тайлагнал боловсруулах", 
      "Өгөгдөлд суурилсан шийдвэр"
    ],
    icon: DollarSign,
    levelColor: "accent"
  },
  {
    id: "information-systems",
    title: "Мэдээллийн систем",
    level: "Бакалавр", 
    duration: "4 жил • Өдрийн/Оройн",
    skills: [
      "Веб хөгжүүлэлт",
      "Өгөгдлийн сан",
      "Автомажуулалт"
    ],
    icon: Cpu,
    levelColor: "accent"
  },
  {
    id: "business-management",
    title: "Бизнесийн удирдлага",
    level: "Магистр",
    duration: "1.5 жил • Оройн", 
    skills: [
      "Стратеги боловсруулах",
      "Манлайлал",
      "Аналитик ур чадвар"
    ],
    icon: Lightbulb,
    levelColor: "primary"
  }
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Хөтөлбөрүүд
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Олон улсын стандарттай нийцсэн хөтөлбөрүүдийг сонгон суралцаарай
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.id} className="card-hover">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                    <program.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <Badge 
                      variant={program.levelColor === "accent" ? "secondary" : "default"}
                      className={`text-xs font-semibold ${
                        program.levelColor === "accent" 
                          ? "text-accent bg-accent/20" 
                          : "text-primary bg-primary/20"
                      }`}
                    >
                      {program.level}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">
                  {program.title}
                </h3>
                <ul className="text-muted-foreground mb-4 space-y-1">
                  {program.skills.map((skill, index) => (
                    <li key={index}>• {skill}</li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <span>{program.duration}</span>
                </div>
                <Button 
                  className="w-full"
                  data-testid={`button-program-${program.id}`}
                >
                  Дэлгэрэнгүй
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
