import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "", 
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("/api/contact", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Амжилттай",
        description: data.message || "Таны мессеж амжилттай илгээгдлээ!",
      });
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "", 
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Алдаа",
        description: error.message || "Мессеж илгээхэд алдаа гарлаа",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Алдаа",
        description: "Бүх шаардлагатай талбарыг бөглөнө үү",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Алдаа", 
        description: "Зөв имэйл хаяг оруулна уу",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Хаяг",
      value: "Улаанбаатар, Монгол Улс",
      color: "primary"
    },
    {
      icon: Phone,
      title: "Утас", 
      value: "+976 ...",
      color: "accent"
    },
    {
      icon: Mail,
      title: "Имэйл",
      value: "info@mandakh.edu.mn",
      color: "primary"
    },
    {
      icon: Clock,
      title: "Ажлын цаг",
      value: "Даваа–Баасан 09:00–18:00", 
      color: "accent"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Холбоо барих
          </h2>
          <p className="text-lg text-muted-foreground">
            Асуулт байвал бидэнтэй холбогдоорой
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-card-foreground">
                Мессеж илгээх
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Нэр</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Утас</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Имэйл</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Зурвас</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2 resize-none"
                    data-testid="textarea-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? "Илгээж байна..." : "Илгээх"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-card-foreground">
                  Холбоо барих мэдээлэл
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-10 h-10 ${
                        info.color === "primary" ? "bg-primary" : "bg-accent"
                      } rounded-lg flex items-center justify-center mr-4`}>
                        <info.icon className={`w-5 h-5 ${
                          info.color === "primary" ? "text-primary-foreground" : "text-accent-foreground"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {info.title}
                        </p>
                        <p className="text-muted-foreground">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Google Maps Placeholder */}
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Google Maps Placeholder</p>
                    <p className="text-xs">Координат: Улаанбаатар хот</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
