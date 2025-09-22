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
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const infoIcons = [MapPin, Phone, Mail, Clock];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();
  const { language } = useLanguage();
  const content = translations.contact[language];

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: content.toast.successTitle,
        description: content.toast.successDescription,
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: content.toast.errorTitle,
        description: error?.message || content.toast.submitError,
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

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: content.toast.errorTitle,
        description: content.toast.requiredFields,
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: content.toast.errorTitle,
        description: content.toast.invalidEmail,
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-card-foreground">
                {content.formTitle}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">{content.fields.name}</Label>
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
                  <Label htmlFor="phone">{content.fields.phone}</Label>
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
                  <Label htmlFor="email">{content.fields.email}</Label>
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
                  <Label htmlFor="message">{content.fields.message}</Label>
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
                  {contactMutation.isPending ? content.submit.loading : content.submit.idle}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 text-card-foreground">
                  {content.infoTitle}
                </h3>
                <div className="space-y-4">
                  {content.infoItems.map((info, index) => {
                    const Icon = infoIcons[index];
                    const color = index % 2 === 0 ? "primary" : "accent";

                    return (
                      <div key={`${info.title}-${index}`} className="flex items-center">
                        <div
                          className={`w-10 h-10 ${
                            color === "primary" ? "bg-primary" : "bg-accent"
                          } rounded-lg flex items-center justify-center mr-4`}
                        >
                          {Icon && (
                            <Icon
                              className={`w-5 h-5 ${
                                color === "primary" ? "text-primary-foreground" : "text-accent-foreground"
                              }`}
                            />
                          )}
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
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>{content.map.placeholder}</p>
                    <p className="text-xs">{content.map.coordinates}</p>
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
