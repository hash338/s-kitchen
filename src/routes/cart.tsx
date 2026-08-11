import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — S-Kitchen" },
      {
        name: "description",
        content: "Review the dishes in your S-Kitchen cart before placing your order.",
      },
      { property: "og:title", content: "Your Cart — S-Kitchen" },
      {
        property: "og:description",
        content: "Review your S-Kitchen dishes and continue to takeaway or delivery.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, total, setQuantity, remove, clear } = useCart();
  const { t } = useLang();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-gold-gradient sm:text-4xl">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border/60 bg-card p-8 text-center">
          <p className="text-muted-foreground">{t("cart.empty")}</p>
          <Link
            to="/menu"
            className="mt-5 inline-block rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            {t("cart.browse")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-3">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-lg">{line.name}</p>
                  <p className="price-tag text-sm">{formatPrice(line.price)} {t("cart.each")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-border/60 px-2 py-1">
                    <button
                      aria-label={`Decrease ${line.name}`}
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      className="rounded-full p-1 text-gold hover:bg-accent"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <button
                      aria-label={`Increase ${line.name}`}
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      className="rounded-full p-1 text-gold hover:bg-accent"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="price-tag w-20 text-right">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                  <button
                    aria-label={`Remove ${line.name}`}
                    onClick={() => remove(line.id)}
                    className="rounded-full p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold/40 bg-card p-5">
            <div>
              <p className="text-sm text-muted-foreground">{t("cart.total")}</p>
              <p className="price-tag text-2xl">{formatPrice(total)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={clear}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-destructive"
              >
                {t("cart.clear")}
              </button>
              <Link
                to="/order"
                className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground shadow-gold"
              >
                {t("cart.continue")}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
