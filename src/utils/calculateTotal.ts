import type { SelectedItem, Product } from "../types";

export function calculateTotal(
  items: SelectedItem[],
  products: Product[],
): number {
  return items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}

export function calculateCompareAtTotal(
  items: SelectedItem[],
  products: Product[],
): number {
  return items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    const unitPrice = product.compareAtPrice ?? product.price;
    return sum + unitPrice * item.quantity;
  }, 0);
}

export function calculateSavings(
  items: SelectedItem[],
  products: Product[],
): number {
  return (
    calculateCompareAtTotal(items, products) - calculateTotal(items, products)
  );
}

// getMonthlyTotal is a helper function that returns the total cost of the plan products in the cart

export function getMonthlyTotal(
  items: SelectedItem[],
  products: Product[],
): number {
  const planProducts = products.filter((p) => p.category === "plan");
  return items.reduce((sum, item) => {
    const product = planProducts.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);
}
