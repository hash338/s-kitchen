import { Link } from "@tanstack/react-router";
import { Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/s-kitchen-logo.jpg.asset.json";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/cart", label: "Cart" },
  { to: "/order", label: "Order" },
  { to: "/information", label: "Information" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo.url}
            alt={`${BRAND.name} logo`}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-border"
          />
          <span className="font-display text-lg tracking-wide text-gold-gradient sm:text-xl">
            S-Kitchen
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-gold data-[status=active]:text-gold"
            >
              {item.label}
              {item.to === "/cart" && count > 0 ? (
                <span className="ml-1 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative rounded-md p-2 text-gold transition-colors hover:bg-accent"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-gold px-1.5 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="rounded-md p-2 text-gold transition-colors hover:bg-accent"
            >
              <MenuIcon className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-surface">
              <SheetTitle className="font-display text-gold">S-Kitchen</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-gold data-[status=active]:text-gold"
                  >
                    {item.label}
                    {item.to === "/cart" && count > 0 ? ` (${count})` : ""}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
