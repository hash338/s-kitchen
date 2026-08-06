import { useQuery } from "@tanstack/react-query";
import { UtensilsCrossed } from "lucide-react";
import { resolveImageUrl } from "@/lib/menu-data";
import { cn } from "@/lib/utils";

export function DishImage({
  path,
  alt,
  className,
}: {
  path: string | null;
  alt: string;
  className?: string;
}) {
  const { data: url } = useQuery({
    queryKey: ["dish-image", path],
    queryFn: () => resolveImageUrl(path),
    enabled: Boolean(path),
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-secondary",
        className,
      )}
    >
      {url ? (
        <img src={url} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <UtensilsCrossed className="h-8 w-8 text-gold-soft/50" aria-hidden />
      )}
    </div>
  );
}
