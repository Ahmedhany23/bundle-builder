import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { loadFromStorage, saveToStorage } from "../hooks/useLocalStorage";
import type { BundleState } from "../types";
import debounce from "debounce";

type Action = {
  type: "SET_QUANTITY";
  productId: string;
  variantId?: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
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
      const minQuantity = action.minQuantity;
      const maxQuantity = action.maxQuantity;
      const normalizedQuantity =
        action.quantity < minQuantity
          ? minQuantity
          : Math.min(maxQuantity, action.quantity);

      //Get index of existing item
      const existingIndex = state.items.findIndex(
        (i) =>
          key(i.productId, i.variantId) ===
          key(action.productId, action.variantId),
      );

      const next = [...state.items];

      // if product already exists, update quantity
      if (existingIndex >= 0) {
        //if action is zero or less, remove item from shallow copy (if allowed by minQuantity)
        if (normalizedQuantity <= 0) {
          next.splice(existingIndex, 1);
        } else {
          // if action is greater than zero, update quantity
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: normalizedQuantity,
          };
        }
      }
      // if product doesn't exist, add the product
      else if (normalizedQuantity > 0) {
        next.push({
          productId: action.productId,
          variantId: action.variantId,
          quantity: normalizedQuantity,
        });
      }

      //Return updated state
      return { items: next };
    }
    default:
      return state;
  }
}

const DEFAULT_SEED_ITEMS = [
  { productId: "wyze-sense-hub", quantity: 1 },
  { productId: "wyze-sense-motion-sensor", quantity: 1 },
  { productId: "wyze-microsd-256gb", quantity: 1 },
  { productId: "cam-unlimited-plan", quantity: 1 },
];

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bundleReducer, { items: DEFAULT_SEED_ITEMS }, () => {
    return loadFromStorage({ items: DEFAULT_SEED_ITEMS });
  });

  const debouncedSave = useMemo(
    () => debounce((state: BundleState) => saveToStorage(state), 300),
    [],
  );

  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  useEffect(() => {
    return () => debouncedSave.clear();
  }, [debouncedSave]);

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
