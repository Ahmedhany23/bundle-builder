import { describe, it, expect } from "vitest";

import type { BundleState, SelectedItem } from "../../types";
import { bundleReducer } from "../BundleContext";

type Action = {
  type: "SET_QUANTITY";
  productId: string;
  variantId?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  required: boolean;
};

function makeState(items: SelectedItem[] = []): BundleState {
  return { items };
}

describe("bundleReducer", () => {
  describe("SET_QUANTITY", () => {
    it("adds a new item when it doesn't exist and quantity is positive", () => {
      const state = makeState([]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 2,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", variantId: undefined, quantity: 2 },
      ]);
    });

    it("does not add a new item when normalized quantity is 0 or less", () => {
      const state = makeState([]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 0,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([]);
    });

    it("updates the quantity of an existing item", () => {
      const state = makeState([{ productId: "p1", quantity: 2 }]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 5,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([{ productId: "p1", quantity: 5 }]);
    });

    it("removes an existing item when normalized quantity is 0 or less", () => {
      const state = makeState([{ productId: "p1", quantity: 2 }]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 0,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([]);
    });

    it("clamps quantity up to minQuantity when below it (required product)", () => {
      const state = makeState([]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 1,
        minQuantity: 3,
        maxQuantity: 10,
        required: true,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", variantId: undefined, quantity: 3 },
      ]);
    });

    it("does NOT remove an existing item when required, even at quantity 0 — clamps to minQuantity instead", () => {
      const state = makeState([{ productId: "p1", quantity: 3 }]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 0,
        minQuantity: 3,
        maxQuantity: 10,
        required: true,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([{ productId: "p1", quantity: 3 }]);
    });

    it("clamps quantity down to maxQuantity when above it", () => {
      const state = makeState([]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 20,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", variantId: undefined, quantity: 10 },
      ]);
    });



    it("treats different variantIds for the same productId as distinct items", () => {
      const state = makeState([
        { productId: "p1", variantId: "v1", quantity: 2 },
      ]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        variantId: "v2",
        quantity: 3,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", variantId: "v1", quantity: 2 },
        { productId: "p1", variantId: "v2", quantity: 3 },
      ]);
    });

    it("updates the correct variant without affecting other variants of the same product", () => {
      const state = makeState([
        { productId: "p1", variantId: "v1", quantity: 2 },
        { productId: "p1", variantId: "v2", quantity: 4 },
      ]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        variantId: "v1",
        quantity: 9,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", variantId: "v1", quantity: 9 },
        { productId: "p1", variantId: "v2", quantity: 4 },
      ]);
    });

    it("treats an item with no variantId as distinct from one with a variantId, for the same productId", () => {
      const state = makeState([{ productId: "p1", quantity: 2 }]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        variantId: "v1",
        quantity: 5,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result.items).toEqual([
        { productId: "p1", quantity: 2 },
        { productId: "p1", variantId: "v1", quantity: 5 },
      ]);
    });

    it("does not mutate the original state object", () => {
      const state = makeState([{ productId: "p1", quantity: 2 }]);
      const action: Action = {
        type: "SET_QUANTITY",
        productId: "p1",
        quantity: 5,
        minQuantity: 0,
        maxQuantity: 10,
        required: false,
      };
      const result = bundleReducer(state, action);
      expect(result).not.toBe(state);
      expect(state.items).toEqual([{ productId: "p1", quantity: 2 }]);
    });
  });

  it("returns the same state for an unknown action type", () => {
    const state = makeState([{ productId: "p1", quantity: 2 }]);
    // @ts-expect-error testing default branch with an unhandled type
    const result = bundleReducer(state, { type: "UNKNOWN" });
    expect(result).toBe(state);
  });
});
