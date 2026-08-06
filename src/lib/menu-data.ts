import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  is_available: boolean;
  sort_order: number;
};

export type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  order_type: string;
  building_name: string | null;
  floor: string | null;
  side: string | null;
  latitude: number | null;
  longitude: number | null;
  notes: string | null;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  created_at: string;
};

export const menuQueryOptions = queryOptions({
  queryKey: ["menu-items"],
  queryFn: async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as MenuItem[];
  },
});

export const ordersQueryOptions = queryOptions({
  queryKey: ["orders"],
  queryFn: async (): Promise<OrderRow[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as OrderRow[];
  },
});

export async function resolveImageUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from("menu-images").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}
