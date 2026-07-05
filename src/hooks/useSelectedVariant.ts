import { useState } from "react";
import type { Product } from "../types";

export function useSelectedVariant(product: Product) {
  const initial =
    product.variants && product.variants.length > 0
      ? product.variants[0].id
      : undefined;

  const [activeVariantId, setActiveVariantId] = useState<string | undefined>(
    initial,
  );

  return { activeVariantId, setActiveVariantId };
}
