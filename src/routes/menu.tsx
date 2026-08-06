import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { menuQueryOptions, type MenuItem } from "@/lib/menu-data";
import { formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { DishImage } from "@/components/DishImage";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — S-Kitchen Saksakiyeh" },
      {
        name: "description",
        content:
          "Browse the S-Kitchen menu: Lebanese mezze, salads, main dishes and desserts with fresh daily prices.",
      },
      { property: "og:title", content: "Menu — S-Kitchen" },
      {
        property: "og:description",
        content: "Lebanese mezze, salads, mains and desserts, cooked fresh every day.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(menuQueryOptions),
  component: MenuPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-8 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
  notFoundComponent: () => <div className="p-8 text-center">No dishes yet.</div>,
});

function MenuPage() {
  const { data: items } = useSuspenseQuery(menuQueryOptions);
  const { add } = useCart();

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-3xl text-gold-gradient sm:text-4xl">Our Menu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything is cooked fresh. Add what you like, then head to your cart.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          The menu is being updated. Please check back soon.
        </p>
      ) : (
        categories.map((category) => (
          <section key={category} className="mt-12">
            <h2 className="font-display text-2xl text-gold">{category}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onAdd={() => {
                      add({ id: item.id, name: item.name, price: Number(item.price) });
                      toast.success(`${item.name} added to your cart`);
                    }}
                  />
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function DishCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-shadow hover:shadow-gold">
      <DishImage path={item.image_url} alt={item.name} className="h-44 w-full" />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg">{item.name}</h3>
        <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="price-tag text-lg">{formatPrice(Number(item.price))}</span>
          {item.is_available ? (
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          ) : (
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Sold out
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
