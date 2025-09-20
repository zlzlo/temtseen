import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: 1,
    title: "Бүртгүүлэх",
    description: "Онлайн бүртгэл хийх, хувийн мэдээлэл оруулах"
  },
  {
    step: 2, 
    title: "Бичиг баримт",
    description: "Шаардлагатай баримтуудыг бүрдүүлэх"
  },
  {
    step: 3,
    title: "Шалгалт/Ярилцлага", 
    description: "Элсэлтийн шалгалт болон ярилцлага"
  },
  {
    step: 4,
    title: "Элсэлт баталгаажуулах",
    description: "Элсэн орох эрхийг баталгаажуулах"
  }
];

export default function AdmissionsSection() {
  return (
    <section id="admissions" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Элсэлт
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Элсэлтийн үйл явц, шаардлага, хугацаа
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((stepInfo) => (
            <div key={stepInfo.step} className="text-center">
              <div className={`w-16 h-16 ${stepInfo.step === 4 ? 'bg-accent' : 'bg-primary'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${stepInfo.step === 4 ? 'text-accent-foreground' : 'text-primary-foreground'}`}>
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

        {/* Requirements */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-card-foreground">
              Шаардлагатай баримтууд
            </h3>
            <p className="text-muted-foreground mb-6">
              Онлайн бүртгэл нээлттэй. Бүрдүүлэх материал: иргэний үнэмлэх, цээж зураг, ЭЕШ оноо/дунд сургуулийн голч дүн, цахим төлбөрийн баримт.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex items-center"
                data-testid="button-download-guide"
              >
                <Download className="w-5 h-5 mr-2" />
                Элсэлтийн журам (PDF)
              </Button>
              <Button 
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-register-online"
              >
                Онлайн бүртгүүлэх
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
