import { useMemo, useState } from "react";
import type { Product } from "../types";
import { useBundle } from "../context/BundleContext";

export function useSelectedVariant(product: Product) {
  const { state } = useBundle();

  const restoredVariant = useMemo(
    () => state.items.find((item) => item.productId === product.id)?.variantId,
    [state.items, product.id],
  );
  const [manualVariant, setManualVariant] = useState<string | undefined>(undefined);

  const activeVariantId = manualVariant ?? restoredVariant ?? product.variants?.[0]?.id;

  return {
    activeVariantId,
    setActiveVariantId: setManualVariant,
  };
}