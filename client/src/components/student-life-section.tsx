import { Users, DollarSign, Building, Book, Zap, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const facilityIcons = [Users, DollarSign, Building, Book, Zap, Trophy];
const facilityColors = ["primary", "accent", "primary", "accent", "primary", "accent"] as const;

export default function StudentLifeSection() {
  const { language } = useLanguage();
  const content = translations.studentLife[language];

  return (
    <section id="student-life" className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.facilities.map((facility, index) => {
            const Icon = facilityIcons[index];
            const color = facilityColors[index] ?? "primary";

            return (
              <Card key={facility.title} className="card-hover text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${
                      color === "primary" ? "bg-primary" : "bg-accent"
                    } rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-8 h-8 ${
                          color === "primary" ? "text-primary-foreground" : "text-accent-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                    {facility.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {facility.description}
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
