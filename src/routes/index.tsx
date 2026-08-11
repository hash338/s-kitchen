import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MapPin, Truck } from "lucide-react";
import logo from "@/assets/s-kitchen-logo.jpg.asset.json";
import { menuQueryOptions } from "@/lib/menu-data";
import { BRAND, formatPrice } from "@/lib/brand";
import { DishImage } from "@/components/DishImage";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "S-Kitchen — Lebanese Home Cooking in Saksakiyeh" },
      {
        name: "description",
        content:
          "Fresh Lebanese home cooking from S-Kitchen in Saksakiyeh. Order takeaway or delivery in a few taps.",
      },
      { property: "og:title", content: "S-Kitchen — Lebanese Home Cooking" },
      {
        property: "og:description",
        content: "Browse the S-Kitchen menu and order takeaway or delivery in Saksakiyeh.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQueryOptions),
  component: Home,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-8 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
});

function Home() {
  const { data: items } = useSuspenseQuery(menuQueryOptions);
  const { t } = useLang();
  const featured = items.filter((item) => item.is_today).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-24">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              <span className="text-gold-gradient">Salma's Kitchen</span>
              <br />
              <span className="text-foreground">cooked with love</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground md:mx-0">
              {t("home.tagline")}. {t("home.heroSub")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold transition-opacity hover:opacity-90"
              >
                {t("home.seeMenu")} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={BRAND.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-accent"
              >
                {t("home.whatsapp")}
              </a>
            </div>
          </div>
          <div className="flex-1">
            <img
              src={logo.url}
              alt="S-Kitchen gold hexagon logo"
              className="mx-auto w-64 rounded-2xl shadow-gold sm:w-80"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3">
        {[
          { icon: Truck, title: t("home.card1.title"), text: t("home.card1.text") },
          { icon: Clock, title: t("home.card2.title"), text: t("home.card2.text") },
          { icon: MapPin, title: BRAND.locationLabel, text: t("home.card3.text") },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border/60 bg-card p-5 text-center sm:text-left"
          >
            <card.icon className="mx-auto h-6 w-6 text-gold sm:mx-0" />
            <h3 className="mt-3 font-display text-lg text-foreground">{card.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{card.text}</p>
          </div>
        ))}
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-4 pb-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl text-gold-gradient sm:text-3xl">
              Today's dishes
            </h2>
            <Link to="/menu" className="text-sm font-semibold text-gold hover:underline">
              {t("home.fullMenu")}
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-5 lg:grid-cols-3">
            {featured.map((item) => (
              <article
                key={item.id}
                className="relative overflow-hidden rounded-xl border border-border/60 bg-card"
              >
                <DishImage
                  path={item.image_url}
                  alt={item.name}
                  className="h-24 w-full sm:h-40"
                />
                {!item.is_available ? (
                  <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                    {t("common.soldOut")}
                  </span>
                ) : null}
                <div className="p-2 sm:p-4">
                  <h3 className="font-display text-sm leading-tight sm:text-lg">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                  <p className="mt-2 price-tag text-sm sm:mt-3 sm:text-base">
                    {formatPrice(Number(item.price))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
