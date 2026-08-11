import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Place Your Order — S-Kitchen" },
      {
        name: "description",
        content:
          "Send your S-Kitchen order: choose takeaway or delivery, add your name, phone and building details.",
      },
      { property: "og:title", content: "Place Your Order — S-Kitchen" },
      {
        property: "og:description",
        content: "Takeaway or delivery in Saksakiyeh — send your order in under a minute.",
      },
    ],
  }),
  component: OrderPage,
});

const baseSchema = z.object({
  customer_name: z.string().trim().min(2, "order.err.name").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "order.err.phone")
    .max(25)
    .regex(/^[0-9+\-\s()]+$/, "order.err.phoneChars"),
  order_type: z.enum(["takeaway", "delivery"]),
  building_name: z.string().trim().max(120).optional(),
  floor: z.string().trim().max(40).optional(),
  side: z.enum(["right", "left", ""]).optional(),
  notes: z.string().trim().max(500).optional(),
});

type Coords = { lat: number; lng: number } | null;

const ERROR_KEYS = ["order.err.name", "order.err.phone", "order.err.phoneChars"] as const;

function translateError(message: string, t: (key: (typeof ERROR_KEYS)[number]) => string) {
  return (ERROR_KEYS as readonly string[]).includes(message)
    ? t(message as (typeof ERROR_KEYS)[number])
    : message;
}

function OrderPage() {
  const { lines, total, clear } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<"takeaway" | "delivery">("takeaway");
  const [coords, setCoords] = useState<Coords>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function locate() {
    if (!navigator.geolocation) {
      toast.error(t("order.err.geoUnsupported"));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success(t("order.geoOk"));
      },
      () => {
        setLocating(false);
        toast.error(t("order.geoFail"));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) {
      toast.error(t("order.err.cart"));
      return;
    }

    const form = new FormData(event.currentTarget);
    const parsed = baseSchema.safeParse({
      customer_name: String(form.get("customer_name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      order_type: orderType,
      building_name: String(form.get("building_name") ?? ""),
      floor: String(form.get("floor") ?? ""),
      side: String(form.get("side") ?? ""),
      notes: String(form.get("notes") ?? ""),
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = translateError(issue.message, t);
      }
      setErrors(next);
      return;
    }

    const values = parsed.data;

    if (orderType === "delivery") {
      const missing: Record<string, string> = {};
      if (!values.building_name) missing["building_name"] = t("order.err.building");
      if (!values.floor) missing["floor"] = t("order.err.floor");
      if (!values.side) missing["side"] = t("order.err.side");
      if (Object.keys(missing).length > 0) {
        setErrors(missing);
        return;
      }
    }

    setErrors({});
    setSubmitting(true);

    const { error } = await supabase.from("orders").insert({
      customer_name: values.customer_name,
      phone: values.phone,
      order_type: orderType,
      building_name: orderType === "delivery" ? (values.building_name ?? null) : null,
      floor: orderType === "delivery" ? (values.floor ?? null) : null,
      side: orderType === "delivery" ? (values.side || null) : null,
      latitude: orderType === "delivery" ? (coords?.lat ?? null) : null,
      longitude: orderType === "delivery" ? (coords?.lng ?? null) : null,
      notes: values.notes || null,
      items: lines,
      total,
    });

    setSubmitting(false);

    if (error) {
      toast.error(t("order.sendFail"));
      return;
    }

    clear();
    toast.success(t("order.sent"));
    void navigate({ to: "/" });
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-gold-gradient sm:text-4xl">Place your order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("order.sub")}
      </p>

      <div className="mt-8 rounded-xl border border-border/60 bg-card p-5">
        <h2 className="font-display text-lg text-gold">{t("order.summary")}</h2>
        {lines.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("cart.empty")}{" "}
            <Link to="/menu" className="text-gold hover:underline">
              {t("order.addDishes")}
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {line.quantity} × {line.name}
                </span>
                <span className="price-tag">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 border-t border-border/50 pt-2 font-semibold">
              <span>{t("cart.total")}</span>
              <span className="price-tag">{formatPrice(total)}</span>
            </li>
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_name" className="text-sm font-medium">
              {t("order.name")}
            </label>
            <input id="customer_name" name="customer_name" maxLength={80} className={fieldClass} />
            {errors["customer_name"] ? (
              <p className="mt-1 text-xs text-destructive">{errors["customer_name"]}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              {t("order.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              inputMode="tel"
              maxLength={25}
              placeholder="70 000 000"
              className={fieldClass}
            />
            {errors["phone"] ? (
              <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>
            ) : null}
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">{t("order.how")}</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(["takeaway", "delivery"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                aria-pressed={orderType === type}
                className={`rounded-lg border px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                  orderType === type
                    ? "border-gold bg-accent text-gold"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {type === "takeaway" ? t("order.takeaway") : t("order.delivery")}
              </button>
            ))}
          </div>
        </fieldset>

        {orderType === "delivery" ? (
          <div className="space-y-5 rounded-xl border border-gold/40 bg-card p-5">
            <h2 className="font-display text-lg text-gold">{t("order.deliveryDetails")}</h2>

            <div>
              <p className="text-sm font-medium">{t("order.locationLabel")}</p>
              <button
                type="button"
                onClick={locate}
                disabled={locating}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:bg-accent disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}
                {coords ? t("order.updateLocation") : t("order.useLocation")}
              </button>
              {coords ? (
                <div className="mt-3 space-y-2">
                  <iframe
                    title="Selected delivery location"
                    className="h-56 w-full rounded-lg border border-border"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=17&output=embed`}
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gold hover:underline"
                  >
                    {t("order.openMaps")} <span dir="ltr">({coords.lat.toFixed(5)}, {coords.lng.toFixed(5)})</span>
                  </a>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("order.locationHint")}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="building_name" className="text-sm font-medium">
                  {t("order.building")}
                </label>
                <input
                  id="building_name"
                  name="building_name"
                  maxLength={120}
                  className={fieldClass}
                />
                {errors["building_name"] ? (
                  <p className="mt-1 text-xs text-destructive">{errors["building_name"]}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="floor" className="text-sm font-medium">
                  {t("order.floor")}
                </label>
                <input id="floor" name="floor" maxLength={40} className={fieldClass} />
                {errors["floor"] ? (
                  <p className="mt-1 text-xs text-destructive">{errors["floor"]}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="side" className="text-sm font-medium">
                {t("order.side")}
              </label>
              <select id="side" name="side" defaultValue="" className={fieldClass}>
                <option value="">{t("order.choose")}</option>
                <option value="right">{t("order.right")}</option>
                <option value="left">{t("order.left")}</option>
              </select>
              {errors["side"] ? (
                <p className="mt-1 text-xs text-destructive">{errors["side"]}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>
          <label htmlFor="notes" className="text-sm font-medium">
            {t("order.notes")}
          </label>
          <textarea id="notes" name="notes" rows={3} maxLength={500} className={fieldClass} />
        </div>

        <button
          type="submit"
          disabled={submitting || lines.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-gold transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("order.submit")}
        </button>
      </form>
    </div>
  );
}
