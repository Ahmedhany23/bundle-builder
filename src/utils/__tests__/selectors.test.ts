import { describe, it, expect } from "vitest";
import type { Product, SelectedItem } from "../../types";
import {
  getItemsForCategory,
  getQuantity,
  getSelectedCount,
  getSelectedCountForCategory,
} from "../selectors";

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

describe("getQuantity", () => {
  it("returns the quantity for a matching productId with no variantId", () => {
    const items: SelectedItem[] = [{ productId: "p1", quantity: 3 }];
    expect(getQuantity(items, "p1")).toBe(3);
  });

  it("returns the quantity for a matching productId and variantId", () => {
    const items: SelectedItem[] = [
      { productId: "p1", variantId: "v1", quantity: 3 },
    ];
    expect(getQuantity(items, "p1", "v1")).toBe(3);
  });
  it("returns 0 when productId is not found", () => {
    const items: SelectedItem[] = [{ productId: "p1", quantity: 3 }];
    expect(getQuantity(items, "missing")).toBe(0);
  });

  it("returns 0 when productId matches but variantId does not", () => {
    const items: SelectedItem[] = [
      { productId: "p1", variantId: "v1", quantity: 3 },
    ];
    expect(getQuantity(items, "p1", "v2")).toBe(0);
  });

  it("does not match an item with a variantId when no variantId is passed", () => {
    const items: SelectedItem[] = [
      { productId: "p1", variantId: "v1", quantity: 3 },
    ];
    // item.variantId is "v1", queried variantId is undefined -> no match
    expect(getQuantity(items, "p1")).toBe(0);
  });

  it("returns 0 for an empty item list", () => {
    expect(getQuantity([], "p1")).toBe(0);
  });
});

describe("getSelectedCount", () => {
  it("counts items with quantity > 0", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 1 },
      { productId: "p2", quantity: 2 },
      { productId: "p3", quantity: 0 },
    ];
    expect(getSelectedCount(items)).toBe(2);
  });

  it("returns 0 when all quantities are 0", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 0 },
      { productId: "p2", quantity: 0 },
    ];
    expect(getSelectedCount(items)).toBe(0);
  });

  it("returns 0 for an empty item list", () => {
    expect(getSelectedCount([])).toBe(0);
  });
});

describe("getSelectedCountForCategory", () => {
  const categoryProducts: Product[] = [
    makeProduct({ id: "p1", category: "camera" }),
    makeProduct({ id: "p2", category: "camera" }),
  ];

  it("counts only items whose productId is in categoryProducts and quantity > 0", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 1 }, // in category, counted
      { productId: "p2", quantity: 0 }, // in category, but qty 0
      { productId: "p3", quantity: 2 }, // not in category
    ];
    expect(getSelectedCountForCategory(items, categoryProducts)).toBe(1);
  });

  it("returns 0 when categoryProducts is empty", () => {
    const items: SelectedItem[] = [{ productId: "p1", quantity: 1 }];
    expect(getSelectedCountForCategory(items, [])).toBe(0);
  });

  it("returns 0 when items is empty", () => {
    expect(getSelectedCountForCategory([], categoryProducts)).toBe(0);
  });
});

describe("getItemsForCategory", () => {
  const categoryProducts: Product[] = [
    makeProduct({ id: "p1", category: "camera" }),
    makeProduct({ id: "p2", category: "camera" }),
  ];

  it("returns only items in the category with quantity > 0", () => {
    const items: SelectedItem[] = [
      { productId: "p1", quantity: 1 },
      { productId: "p2", quantity: 0 }, // excluded: qty 0
      { productId: "p3", quantity: 2 }, // excluded: not in category
    ];
    expect(getItemsForCategory(items, categoryProducts)).toEqual([
      { productId: "p1", quantity: 1 },
    ]);
  });

  it("returns an empty array when nothing matches", () => {
    const items: SelectedItem[] = [{ productId: "p3", quantity: 2 }];
    expect(getItemsForCategory(items, categoryProducts)).toEqual([]);
  });

  it("returns an empty array when items is empty", () => {
    expect(getItemsForCategory([], categoryProducts)).toEqual([]);
  });
});
