import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, LogOut, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { menuQueryOptions, ordersQueryOptions, type MenuItem } from "@/lib/menu-data";
import { formatPrice } from "@/lib/brand";
import { DishImage } from "@/components/DishImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — S-Kitchen" },
      { name: "description", content: "Private S-Kitchen dashboard for orders and menu." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — S-Kitchen" },
      { property: "og:description", content: "Private S-Kitchen dashboard." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { session, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/s-kitchen-staff-2024" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-gold-gradient">Not authorised</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This account is signed in but has no admin access yet.
        </p>
        <button
          onClick={() => void signOut()}
          className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-gold"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-gold-gradient">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <button
          onClick={() => void signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-gold"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList className="bg-secondary">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          <OrdersPanel />
        </TabsContent>
        <TabsContent value="menu" className="mt-6">
          <MenuPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrdersPanel() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery(ordersQueryOptions);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const removeOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-gold" />;
  if (!orders || orders.length === 0)
    return <p className="text-sm text-muted-foreground">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  order.order_type === "delivery"
                    ? "bg-gold-gradient text-primary-foreground"
                    : "border border-gold/60 text-gold"
                }`}
              >
                {order.order_type}
              </span>
              <h3 className="mt-2 font-display text-xl">{order.customer_name}</h3>
              <a href={`tel:${order.phone}`} className="text-sm text-gold hover:underline">
                {order.phone}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="price-tag text-xl">{formatPrice(Number(order.total))}</p>
              <select
                value={order.status}
                onChange={(event) =>
                  updateStatus.mutate({ id: order.id, status: event.target.value })
                }
                className="mt-2 rounded-lg border border-input bg-secondary px-2 py-1.5 text-xs"
              >
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="on_the_way">On the way</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <ul className="mt-4 space-y-1 border-t border-border/50 pt-3 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {item.quantity} × {item.name}
                </span>
                <span className="price-tag">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          {order.order_type === "delivery" ? (
            <div className="mt-4 space-y-1 rounded-lg bg-secondary p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Building: </span>
                {order.building_name ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Floor: </span>
                {order.floor ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Side: </span>
                {order.side ?? "—"}
              </p>
              {order.latitude && order.longitude ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gold hover:underline"
                >
                  <MapPin className="h-4 w-4" /> Open location in Google Maps
                </a>
              ) : (
                <p className="text-muted-foreground">No map location shared</p>
              )}
            </div>
          ) : null}

          {order.notes ? (
            <p className="mt-3 text-sm text-muted-foreground">Notes: {order.notes}</p>
          ) : null}

          <button
            onClick={() => removeOrder.mutate(order.id)}
            className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete order
          </button>
        </article>
      ))}
    </div>
  );
}

type Draft = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  is_available: boolean;
  is_today: boolean;
  sort_order: string;
  image_url: string | null;
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  price: "",
  category: "Main",
  is_available: true,
  is_today: false,
  sort_order: "0",
  image_url: null,
};

function MenuPanel() {
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useQuery(menuQueryOptions);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);

  const save = useMutation({
    mutationFn: async (value: Draft) => {
      const payload = {
        name: value.name.trim(),
        description: value.description.trim(),
        price: Number(value.price) || 0,
        category: value.category.trim() || "Main",
        is_available: value.is_available,
        is_today: value.is_today,
        sort_order: Number(value.sort_order) || 0,
        image_url: value.image_url,
      };
      if (!payload.name) throw new Error("Name is required");
      const { error } = value.id
        ? await supabase.from("menu_items").update(payload).eq("id", value.id)
        : await supabase.from("menu_items").insert(payload);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setDraft(null);
      toast.success("Menu saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Item deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft((prev) => (prev ? { ...prev, image_url: path } : prev));
    toast.success("Picture uploaded");
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div>
      <button
        onClick={() => setDraft({ ...emptyDraft })}
        className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-bold text-primary-foreground"
      >
        <Plus className="h-4 w-4" /> New item
      </button>

      {draft ? (
        <div className="mt-6 space-y-4 rounded-xl border border-gold/40 bg-card p-5">
          <h3 className="font-display text-lg text-gold">
            {draft.id ? "Edit item" : "New item"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="item-name">
                Name
              </label>
              <input
                id="item-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                maxLength={100}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="item-price">
                Price ($)
              </label>
              <input
                id="item-price"
                type="number"
                step="0.25"
                min="0"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="item-category">
                Category
              </label>
              <input
                id="item-category"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                maxLength={40}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="item-order">
                Sort order
              </label>
              <input
                id="item-order"
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="item-description">
              Description
            </label>
            <textarea
              id="item-description"
              rows={2}
              maxLength={400}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.is_available}
                onChange={(e) => setDraft({ ...draft, is_available: e.target.checked })}
                className="h-4 w-4 accent-[var(--gold)]"
              />
              Available
            </label>
            <label className="text-sm">
              <span className="mr-2 text-muted-foreground">Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
                className="text-xs"
              />
            </label>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin text-gold" /> : null}
            {draft.image_url ? (
              <DishImage
                path={draft.image_url}
                alt="Selected picture"
                className="h-16 w-16 rounded-lg"
              />
            ) : null}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => save.mutate(draft)}
              disabled={save.isPending}
              className="rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={() => setDraft(null)}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin text-gold" />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((item) => (
            <AdminItemCard
              key={item.id}
              item={item}
              onEdit={() =>
                setDraft({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  price: String(item.price),
                  category: item.category,
                  is_available: item.is_available,
                  is_today: item.is_today,
                  sort_order: String(item.sort_order),
                  image_url: item.image_url,
                })
              }
              onDelete={() => remove.mutate(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <DishImage path={item.image_url} alt={item.name} className="h-36 w-full" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg">{item.name}</h3>
          <span className="price-tag">{formatPrice(Number(item.price))}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {item.category} · {item.is_available ? "available" : "hidden"}
        </p>
        <div className="mt-3 flex gap-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}
