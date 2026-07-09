import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types";
import { useBundle } from "../context/BundleContext";

export function useSelectedVariant(product: Product) {
  const { state } = useBundle();

  // Derive the variant that is currently stored in global state for this product.
  const restoredVariant = useMemo(
    () =>
      state.items.find((item) => item.productId === product.id)?.variantId,
    [state.items, product.id],
  );

  // useState only reads its initializer once (at mount). If the context state
  // is populated from localStorage after the component first renders, the
  // restoredVariant value will be stale. We sync it in exactly once via a
  // ref-guarded useEffect so the swatch UI reflects what was persisted.
  const [selectedVariant, setSelectedVariant] = useState(
    () => restoredVariant ?? product.variants?.[0]?.id,
  );

  const hasSynced = useRef(false);
  useEffect(() => {
    if (!hasSynced.current && restoredVariant !== undefined) {
      hasSynced.current = true;
      setSelectedVariant(restoredVariant);
    }
  }, [restoredVariant]);

  return {
    activeVariantId: selectedVariant,
    setActiveVariantId: setSelectedVariant,
  };
}