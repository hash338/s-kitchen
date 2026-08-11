import { Facebook, Instagram, MapPin, Music2, Phone, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="mt-20 border-t border-border/60 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h2 className="font-display text-xl text-gold-gradient">S-Kitchen</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("home.tagline")}</p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-display text-base text-gold">{t("footer.contact")}</h3>
          <a
            href={BRAND.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <MessageCircle className="h-4 w-4" />
            <span dir="ltr">WhatsApp {BRAND.whatsapp}</span>
          </a>
          <a
            href={BRAND.phoneLink}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr">{BRAND.phone}</span>
          </a>
          <a
            href={BRAND.locationLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <MapPin className="h-4 w-4" />
            <span dir="ltr">{BRAND.locationLabel}</span>
          </a>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-display text-base text-gold">{t("footer.follow")}</h3>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <Facebook className="h-4 w-4" /> Facebook
          </a>
          <a
            href={BRAND.tiktok}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold"
          >
            <Music2 className="h-4 w-4" /> TikTok
          </a>
        </div>
      </div>
      <div className="border-t border-border/40 px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} S-Kitchen — {t("footer.rights")}
      </div>
    </footer>
  );
}
