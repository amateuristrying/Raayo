import { cn } from "@/lib/cn";
import { accentGradients, accentSoftBackgrounds } from "@/lib/accents";
import type { Accent } from "@/types";

type EmojiTileSize = "xs" | "sm" | "md" | "lg";
type EmojiTileShape = "circle" | "rounded";
type EmojiTileVariant = "gradient" | "soft";

interface EmojiTileProps {
  emoji: string;
  accent: Accent;
  size?: EmojiTileSize;
  shape?: EmojiTileShape;
  /** "soft" renders a light tinted background instead of the gradient. */
  variant?: EmojiTileVariant;
  className?: string;
}

const sizeClasses: Record<EmojiTileSize, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-8 text-sm",
  md: "size-9 text-base",
  lg: "size-14 text-2xl",
};

/** Gradient or soft-tinted tile with a centered emoji — entity artwork stand-in. */
export function EmojiTile({
  emoji,
  accent,
  size = "md",
  shape = "circle",
  variant = "gradient",
  className,
}: EmojiTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center",
        variant === "gradient"
          ? cn("bg-gradient-to-br", accentGradients[accent])
          : accentSoftBackgrounds[accent],
        sizeClasses[size],
        shape === "circle" ? "rounded-full" : "rounded-xl",
        className,
      )}
    >
      {emoji}
    </span>
  );
}
