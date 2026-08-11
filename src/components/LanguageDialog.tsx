import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Languages } from "lucide-react";
import logo from "@/assets/s-kitchen-logo.jpg.asset.json";
import { hasChosenLanguage, useLang, type Lang } from "@/lib/i18n";

export function LanguageDialog() {
  const { setLang, t, ready } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!hasChosenLanguage()) setOpen(true);
  }, [ready]);

  function choose(lang: Lang) {
    setLang(lang);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm border-gold/40 bg-surface text-center"
      >
        <img
          src={logo.url}
          alt="S-Kitchen logo"
          className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-gold/50"
        />
        <DialogTitle className="font-display text-xl text-gold-gradient">
          {t("lang.title")}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {t("lang.desc")}
        </DialogDescription>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => choose("en")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            <Languages className="h-4 w-4" /> English
          </button>
          <button
            onClick={() => choose("ar")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/50 px-5 py-3 text-sm font-bold text-gold transition-colors hover:bg-accent"
          >
            <Languages className="h-4 w-4" /> العربية
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label="Change language"
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-accent ${className}`}
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}
