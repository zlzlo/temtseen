import { Facebook, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" }
];

export default function Footer() {
  const { language } = useLanguage();
  const content = translations.footer[language];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
            <p className="text-primary-foreground/80 mb-6">
              {content.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                  data-testid={`link-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{content.quickLinksTitle}</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              {content.quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-primary-foreground transition-colors"
                    data-testid={`footer-link-${link.href.substring(1)}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{content.contactTitle}</h4>
            <ul className="space-y-2 text-primary-foreground/80 text-sm">
              {content.contactInfo.map((info, index) => (
                <li key={`${info}-${index}`}>{info}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
