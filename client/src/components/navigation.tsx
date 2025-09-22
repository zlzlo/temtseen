import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mandakhLogo from "@/assets/mandakh-logo.svg";
import LanguageSwitcher from "@/components/language-switcher";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { language } = useLanguage();
  const navContent = translations.navigation[language];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navContent.items.map((item) => item.href.substring(1));
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language, navContent.items]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="navbar-blur fixed top-0 left-0 right-0 z-40 border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center" data-testid="logo">
            <img
              src={mandakhLogo}
              alt={navContent.logoAlt}
              className="h-12 w-auto"
            />
            <span className="sr-only">{navContent.logoSr}</span>
          </div>

          <div className="flex items-center gap-4">
            <ul className="hidden md:flex space-x-8 text-sm font-medium">
              {navContent.items.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`nav-link transition-colors hover:text-primary ${
                      activeSection === item.href.substring(1)
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                    data-testid={`nav-${item.href.substring(1)}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            <LanguageSwitcher className="hidden md:flex" />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-button"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div id="mobile-navigation" className="md:hidden mt-4 pb-4 space-y-4">
            <LanguageSwitcher />
            <ul className="space-y-4 text-sm font-medium">
              {navContent.items.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="block text-foreground hover:text-primary transition-colors"
                    data-testid={`mobile-nav-${item.href.substring(1)}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
