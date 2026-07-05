import { createContext, useReducer, useEffect, useContext } from "react";
import type { ReactNode } from "react";

import type { BundleState } from "../types";
import { loadFromStorage, saveToStorage } from "../hooks/useLocalStorage";

type Action = {
  type: "SET_QUANTITY";
  productId: string;
  variantId?: string;
  quantity: number;
};

export const BundleContext = createContext<{
  state: BundleState;
  dispatch: React.ActionDispatch<[Action]>;
} | null>(null);

function key(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? "default"}`;
}

export function bundleReducer(state: BundleState, action: Action): BundleState {
  switch (action.type) {
    case "SET_QUANTITY": {
      const existingIndex = state.items.findIndex(
        (i) =>
          key(i.productId, i.variantId) ===
          key(action.productId, action.variantId),
      );

      const next = [...state.items];
      if (existingIndex >= 0) {
        if (action.quantity <= 0) {
          next.splice(existingIndex, 1);
        } else {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: action.quantity,
          };
        }
      } else if (action.quantity > 0) {
        next.push({
          productId: action.productId,
          variantId: action.variantId,
          quantity: action.quantity,
        });
      }
      return { items: next };
    }
    default:
      return state;
  }
}

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bundleReducer, { items: [] }, () => {
    return loadFromStorage({ items: [] });
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <BundleContext.Provider value={{ state, dispatch }}>
      {children}
    </BundleContext.Provider>
  );
}

export function useBundle() {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error("useBundle must be used within BundleProvider");
  return ctx;
}
