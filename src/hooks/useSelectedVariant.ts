import { useState } from "react";
import type { Product } from "../types";
import { useBundle } from "../context/BundleContext";

export function useSelectedVariant(product: Product) {
  const { state } = useBundle();

  // Check if there is a restored variant in the bundle state for the given product
  const restoredVariant = state.items.find(
    (item) => item.productId === product.id,
  )?.variantId;

  const initial = restoredVariant ?? product.variants?.[0]?.id;

  const [activeVariantId, setActiveVariantId] = useState(initial);

  return { activeVariantId, setActiveVariantId };
}
