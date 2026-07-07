import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (restoredVariant) {
      setActiveVariantId(restoredVariant);
    } else {
      setActiveVariantId(product.variants?.[0]?.id);
    }
  }, [restoredVariant, product.variants]);

  return { activeVariantId, setActiveVariantId };
}
