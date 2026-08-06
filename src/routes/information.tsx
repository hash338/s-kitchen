import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import logo from "@/assets/s-kitchen-logo.jpg.asset.json";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Contact & Location — S-Kitchen Saksakiyeh" },
      {
        name: "description",
        content:
          "Call or WhatsApp S-Kitchen on +961 70 313 871, find us at C7QP+FGQ Saksakiyeh, and follow us on Instagram, Facebook and TikTok.",
      },
      { property: "og:title", content: "Contact & Location — S-Kitchen" },
      {
        property: "og:description",
        content: "Phone, WhatsApp, map location and social accounts for S-Kitchen in Saksakiyeh.",
      },
    ],
  }),
  component: InformationPage,
});

const LINKS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BRAND.whatsapp,
    href: BRAND.whatsappLink,
  },
  { icon: Phone, label: "Phone", value: BRAND.phone, href: BRAND.phoneLink },
  { icon: MapPin, label: "Location", value: BRAND.locationLabel, href: BRAND.locationLink },
  { icon: Instagram, label: "Instagram", value: "@salmask1tchen", href: BRAND.instagram },
  { icon: Facebook, label: "Facebook", value: "salmask1tchen", href: BRAND.facebook },
  { icon: Music2, label: "TikTok", value: "@salma.s_kitchen", href: BRAND.tiktok },
];

function InformationPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <header className="text-center">
        <img
          src={logo.url}
          alt="S-Kitchen logo"
          className="mx-auto w-36 rounded-2xl shadow-gold"
        />
        <h1 className="mt-6 font-display text-3xl text-gold-gradient sm:text-4xl">
          Information & Contact
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          S-Kitchen is a home kitchen in Saksakiyeh serving Lebanese classics. Reach us any
          way you like — we answer fastest on WhatsApp.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("tel:") ? undefined : "_blank"}
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-gold/60"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-gold">
              <link.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                {link.label}
              </span>
              <span className="block truncate font-medium text-foreground">{link.value}</span>
            </span>
          </a>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-gold">Find us</h2>
        <iframe
          title="S-Kitchen location in Saksakiyeh"
          className="mt-4 h-72 w-full rounded-xl border border-border"
          loading="lazy"
          src="https://maps.google.com/maps?q=C7QP%2BFGQ%20Saksakiyeh&z=16&output=embed"
        />
      </section>
    </div>
  );
}
