import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supportedLanguages, useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const content = translations.languageSwitcher[language];

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={content.groupLabel}
    >
      {supportedLanguages.map((code) => (
        <Button
          key={code}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLanguage(code)}
          aria-label={content.optionLabels[code]}
          aria-pressed={language === code}
          className={cn(
            "h-8 px-3 text-xs font-semibold uppercase tracking-wide",
            language === code
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
              : "border-input text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {content.optionShort[code]}
        </Button>
      ))}
    </div>
  );
}
