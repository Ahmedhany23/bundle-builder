import type { Product, SelectedItem } from "../../types";
import { ReviewLineItem } from "./ReviewLineItem";

type ReviewSectionProps = {
  label: string;
  items: SelectedItem[];
  categoryProducts: Product[];
  withTopMargin?: boolean;
};

export function ReviewSection({ label, items, categoryProducts, withTopMargin }: ReviewSectionProps) {
  
  return (
    <>
      <p className="section-label" style={withTopMargin ? { marginTop: "16px" } : undefined}>
        {label}
      </p>
      {items.map((item) => {
        const product = categoryProducts.find((p) => p.id === item.productId);
        if (!product) return null;
        return (
          <ReviewLineItem
            key={`${item.productId}:${item.variantId ?? "default"}`}
            product={product}
            variantId={item.variantId}
            quantity={item.quantity}
          />
        );
      })}
    </>
  );
}