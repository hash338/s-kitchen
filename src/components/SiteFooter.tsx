import {
  Facebook,
  Instagram,
  MapPin,
  Music2,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { useLang } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const FOOTER_PHONE = "+961 76 442 108";
const FOOTER_PHONE_TEL = "+96176442108";
const FOOTER_PHONE_WA = "96176442108";

export function SiteFooter() {
  const { t } = useLang();
  const [phoneOpen, setPhoneOpen] = useState(false);

  return (
    <footer className="mt-20 border-t border-border/60 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h2 className="font-display text-xl text-gold-gradient">S-Kitchen</h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {t("home.tagline")}
          </p>
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
        <span>© {new Date().getFullYear()} S-Kitchen — {t("footer.rights")} — </span>
        <button
          type="button"
          onClick={() => setPhoneOpen(true)}
          className="inline font-semibold text-gold underline-offset-2 transition-opacity hover:underline"
        >
          <span dir="ltr">{FOOTER_PHONE}</span>
        </button>
      </div>

      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent className="max-w-sm bg-surface">
          <DialogClose
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="font-display text-gold">
              {t("footer.callPrompt")}
            </DialogTitle>
            <DialogDescription className="text-center text-lg font-semibold text-foreground" dir="ltr">
              {FOOTER_PHONE}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-3">
            <a
              href={`tel:${FOOTER_PHONE_TEL}`}
              className="flex items-center justify-center gap-2 rounded-md bg-gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              {t("footer.call")}
            </a>
            <a
              href={`https://wa.me/${FOOTER_PHONE_WA}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-gold/40 bg-transparent px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-accent"
            >
              <MessageCircle className="h-4 w-4" />
              {t("footer.whatsapp")}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
