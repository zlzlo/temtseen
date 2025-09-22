import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function AdmissionsSection() {
  const { language } = useLanguage();
  const content = translations.admissions[language];

  return (
    <section id="admissions" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {content.steps.map((stepInfo) => (
            <div key={stepInfo.step} className="text-center">
              <div
                className={`w-16 h-16 ${
                  stepInfo.step === 4 ? "bg-accent" : "bg-primary"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <span
                  className={`text-2xl font-bold ${
                    stepInfo.step === 4 ? "text-accent-foreground" : "text-primary-foreground"
                  }`}
                >
                  {stepInfo.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {stepInfo.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {stepInfo.description}
              </p>
            </div>
          ))}
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-card-foreground">
              {content.requirementsTitle}
            </h3>
            <p className="text-muted-foreground mb-6">
              {content.requirementsDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex items-center"
                data-testid="button-download-guide"
              >
                <Download className="w-5 h-5 mr-2" />
                {content.downloadButton}
              </Button>
              <Button
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-register-online"
              >
                {content.registerButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
