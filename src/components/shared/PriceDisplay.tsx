import type { CSSProperties } from "react";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number | null;
  discountLabel?: string | null;
  suffix?: string;

  direction?: "row" | "column";
  align?: "left" | "center" | "right";

  activeColor?: string;
  compareColor?: string;

  className?: string;

  size?: "sm" | "lg";
};

export function PriceDisplay({
  price,
  compareAtPrice,
  discountLabel,
  suffix,
  direction = "column",
  align = "right",
  activeColor,
  compareColor,
  className,
  size = "sm",
}: PriceDisplayProps) {
  const showCompareAt = compareAtPrice != null && compareAtPrice > price;

  const isFree = discountLabel === "FREE";

  const style = {
    "--price-active-color": activeColor,
    "--price-compare-color": compareColor,
  } as CSSProperties;

  return (
    <div
    
      className={[
        "price-display",
        `price-display--${direction}`,
        `price-display--${align}`,
        `price-display--${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      aria-live="polite"
    >
      {showCompareAt && (
        <span className="price-display__compare">
          ${compareAtPrice.toFixed(2)}
          {suffix}
        </span>
      )}

      <span className="price-display__active">
        {isFree ? "FREE" : `$${price.toFixed(2)}${suffix ?? ""}`}
      </span>
    </div>
  );
}
