import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "#home", label: "Нүүр" },
  { href: "#about", label: "Бидний тухай" },
  { href: "#programs", label: "Хөтөлбөрүүд" },
  { href: "#admissions", label: "Элсэлт" },
  { href: "#student-life", label: "Оюутны амьдрал" },
  { href: "#news", label: "Мэдээ" },
  { href: "#partnerships", label: "Түншлэл" },
  { href: "#faq", label: "Асуулт" },
  { href: "#contact", label: "Холбоо барих" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.substring(1));
      const current = sections.find(section => {
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
  }, []);

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
          <div className="text-2xl font-bold text-primary" data-testid="logo">
            Мандах Их Сургууль
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-sm font-medium">
            {navItems.map((item) => (
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="space-y-4 text-sm font-medium">
              {navItems.map((item) => (
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
