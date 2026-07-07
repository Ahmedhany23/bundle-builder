import { describe, it, expect } from "vitest";
import type { Product, SelectedItem } from "../../types";
import {
  calculateCompareAtTotal,
  calculateSavings,
  calculateTotal,
  getMonthlyTotal,
} from "../calculateTotal";

function makeProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    category: "accessory",
    title: "Test Product",
    description: "",
    image: "",
    learnMoreUrl: "",
    price: 0,
    compareAtPrice: null,
    discountLabel: null,
    variants: [],
    required: false,
    minQuantity: 1,
    maxQuantity: 10,
    ...overrides,
  };
}

const products: Product[] = [
  makeProduct({ id: "p1", price: 10, compareAtPrice: 15, category: "camera" }),
  makeProduct({
    id: "p2",
    price: 20,
    compareAtPrice: null,
    category: "accessory",
  }), // no compareAtPrice
  makeProduct({ id: "p3", price: 50, compareAtPrice: 60, category: "plan" }),
  makeProduct({ id: "p4", price: 5, compareAtPrice: null, category: "plan" }), // no compareAtPrice
];

describe("calculateTotal", () => {
  it("sums price * quantity for all products", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 2 },
      { productId: "p2", quantity: 3 },
    ];

    expect(calculateTotal(items, products)).toBe(10 * 2 + 20 * 3); // (p1 price) * 2 (quantity) + (p2 price) * 3 (quantity)
  });

  it("ignore items whose product is not found", () => {
    const items: SelectedItem[] = [{ productId: "missing", quantity: 2 }];

    expect(calculateTotal(items, products)).toBe(0);
  });

  it("returns 0 for empty items", () => {
    const items: SelectedItem[] = [];

    expect(calculateTotal(items, products)).toBe(0);
  });
});

describe("calculateCompareAtTotal", () => {
  it("uses compareAtPrice if available, otherwise uses price", () => {
    const items: SelectedItem[] = [{ productId: "p1", quantity: 2 }];

    expect(calculateCompareAtTotal(items, products)).toBe(15 * 2); // (p1 compareAtPrice) * 2 (quantity)
  });

  it("falls back to price when compareAtPrice is null", () => {
    const items: SelectedItem[] = [{ productId: "p2", quantity: 3 }];
    expect(calculateCompareAtTotal(items, products)).toBe(20 * 3); // (p2 price) * 3 (quantity)
  });

  it("ignore items whose product is not found", () => {
    const items: SelectedItem[] = [{ productId: "missing", quantity: 2 }];

    expect(calculateCompareAtTotal(items, products)).toBe(0);
  });
});

describe("calculateSavings", () => {
  it("returns the difference between total and compareAtTotal", () => {
    const items: SelectedItem[] = [{ productId: "p1", quantity: 2 }];

    expect(calculateSavings(items, products)).toBe(15 * 2 - 10 * 2); // (p1 compareAtPrice) * 2 (quantity) - (p1 price) * 2 (quantity)
  });

  it("returns 0 when no products have a compareAtPrice", () => {
    const items: SelectedItem[] = [{ productId: "p2", quantity: 2 }];
    expect(calculateSavings(items, products)).toBe(0);
  });

  it("ignore items whose product is not found", () => {
    const items: SelectedItem[] = [{ productId: "missing", quantity: 2 }];

    expect(calculateSavings(items, products)).toBe(0);
  });
});

describe("getMonthlyTotal", () => {
  it("only sums products in the 'plan' category", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 1 }, // accessory, excluded
      { productId: "p3", quantity: 2 }, // plan, included
      { productId: "p4", quantity: 1 }, // plan, included
    ];
    expect(getMonthlyTotal(items, products)).toBe(50 * 2 + 5 * 1);
  });

  it("returns 0 if no plan products are in the items", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 1 }, // accessory
      { productId: "p2", quantity: 2 }, // accessory
    ];
    expect(getMonthlyTotal(items, products)).toBe(0);
  });

  it("ignores items whose product is not found", () => {
    const items: SelectedItem[] = [{ productId: "missing", quantity: 5 }];
    expect(getMonthlyTotal(items, products)).toBe(0);
  });

  it("returns 0 for an empty item list", () => {
    expect(getMonthlyTotal([], products)).toBe(0);
  });
});
