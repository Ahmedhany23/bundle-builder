import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelectedVariant } from "../useSelectedVariant";
import type { Product, BundleState } from "../../types";
import { useBundle } from "../../context/BundleContext";

vi.mock("../../context/BundleContext", () => ({
  useBundle: vi.fn(),
}));

const mockUseBundle = vi.mocked(useBundle);

function makeProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    category: "camera",
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

function mockBundleState(state: BundleState) {
  mockUseBundle.mockReturnValue({ state, dispatch: vi.fn() });
}

describe("useSelectedVariant", () => {
  beforeEach(() => {
    mockUseBundle.mockReset();
  });

  it("defaults to the first variant when no item exists in state", () => {
    const product = makeProduct({
      id: "p1",
      variants: [
        { id: "v1", name: "Small", path: "/small" },
        { id: "v2", name: "Large", path: "/large" },
      ],
    });
    mockBundleState({ items: [] });

    const { result } = renderHook(() => useSelectedVariant(product));

    expect(result.current.activeVariantId).toBe("v1");
  });

  it("restores the variant from an existing item in state", () => {
    const product = makeProduct({
      id: "p1",
      variants: [
        { id: "v1", name: "Small", path: "/small" },
        { id: "v2", name: "Large", path: "/large" },
      ],
    });
    mockBundleState({
      items: [{ productId: "p1", variantId: "v2", quantity: 1 }],
    });

    const { result } = renderHook(() => useSelectedVariant(product));

    expect(result.current.activeVariantId).toBe("v2");
  });

  it("prefers the restored variant over the first variant even if they differ", () => {
    const product = makeProduct({
      id: "p1",
      variants: [
        { id: "v1", name: "Small", path: "/small" },
        { id: "v2", name: "Large", path: "/large" },
        { id: "v3", name: "Medium", path: "/medium" },
      ],
    });
    mockBundleState({
      items: [{ productId: "p1", variantId: "v3", quantity: 1 }],
    });

    const { result } = renderHook(() => useSelectedVariant(product));

    expect(result.current.activeVariantId).toBe("v3");
  });

  it("is undefined when product has no variants and no item in state", () => {
    const product = makeProduct({ id: "p1", variants: [] });
    mockBundleState({ items: [] });

    const { result } = renderHook(() => useSelectedVariant(product));

    expect(result.current.activeVariantId).toBeUndefined();
  });

  it("ignores items in state belonging to other products", () => {
    const product = makeProduct({
      id: "p1",
      variants: [{ id: "v1", name: "Small", path: "/small" }],
    });
    mockBundleState({
      items: [{ productId: "p2", variantId: "v9", quantity: 1 }],
    });

    const { result } = renderHook(() => useSelectedVariant(product));

    expect(result.current.activeVariantId).toBe("v1");
  });

  it("setActiveVariantId updates the returned activeVariantId", () => {
    const product = makeProduct({
      id: "p1",
      variants: [
        { id: "v1", name: "Small", path: "/small" },
        { id: "v2", name: "Large", path: "/large" },
      ],
    });
    mockBundleState({ items: [] });

    const { result } = renderHook(() => useSelectedVariant(product));
    expect(result.current.activeVariantId).toBe("v1");

    act(() => {
      result.current.setActiveVariantId("v2");
    });

    expect(result.current.activeVariantId).toBe("v2");
  });
});
