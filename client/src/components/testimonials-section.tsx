import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Б.Анударь",
    program: "Санхүү 2023",
    quote: "Ажилд гарах бэлтгэлтэй болгосон практик курсууд надад их тус болсон.",
    initials: "Б.А",
    color: "primary"
  },
  {
    name: "Т.Баярмаа", 
    program: "Мэдээллийн систем 2022",
    quote: "Орчин үеийн технологийн мэдлэг, практик туршлага олж авсан.",
    initials: "Т.Б",
    color: "accent"
  },
  {
    name: "Д.Ганбат",
    program: "MBA 2021", 
    quote: "Удирдлагын чадварыг хөгжүүлэх боломж олдсон нь миний карьерт чухал үүрэг гүйцэтгэсэн.",
    initials: "Д.Г",
    color: "primary"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Төгсөгчдийн сэтгэгдэл
          </h2>
          <p className="text-lg text-muted-foreground">
            Манай төгсөгчид хэлэх үг
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${
                    testimonial.color === "primary" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  } rounded-full flex items-center justify-center font-bold`}>
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
