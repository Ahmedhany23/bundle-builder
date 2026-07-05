import type { SelectedItem, Product } from "../types";

export function getQuantity(
  items: SelectedItem[],
  productId: string,
  variantId?: string,
) {
  return (
    items.find((i) => i.productId === productId && i.variantId === variantId)
      ?.quantity ?? 0
  );
}

export function getSelectedCount(items: SelectedItem[]) {
  return items.filter((i) => i.quantity > 0).length;
}


export function getSelectedCountForCategory(
  items: SelectedItem[],
  categoryProducts: Product[],
): number {
  const categoryProductIds = new Set(categoryProducts.map((p) => p.id));
  return items.filter(
    (i) => categoryProductIds.has(i.productId) && i.quantity > 0,
  ).length;
}

export function getItemsForCategory(
  items: SelectedItem[],
  categoryProducts: Product[],
): SelectedItem[] {
  const categoryProductIds = new Set(categoryProducts.map((p) => p.id));
  return items.filter(
    (i) => categoryProductIds.has(i.productId) && i.quantity > 0,
  );
}
