export const BRAND = {
  name: "S-Kitchen",
  tagline: "Lebanese home cooking, made fresh every day",
  whatsapp: "+961 70 313 871",
  whatsappLink: "https://wa.me/96170313871",
  phone: "+961 70 313 871",
  phoneLink: "tel:+96170313871",
  locationLabel: "C7QP+FGQ, Saksakiyeh",
  locationLink: "https://www.google.com/maps/search/?api=1&query=C7QP%2BFGQ+Saksakiyeh",
  tiktok: "https://www.tiktok.com/@salma.s_kitchen",
  instagram: "https://www.instagram.com/salmask1tchen",
  facebook: "https://www.facebook.com/salmask1tchen",
} as const;

export const ADMIN_LOGIN_PATH = "/s-kitchen-staff-2024";

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}
