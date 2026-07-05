import { useBundle } from "../../context/BundleContext";
import { getItemsForCategory } from "../../utils/selectors";
import productsData from "../../data/products.json";
import type { Product } from "../../types";

import WyzeIcon from "../../assets/icons/wyze-icon.svg";
import { PriceDisplay } from "../shared/PriceDisplay";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const products = productsData as Product[];

export function ReviewPlanRow() {
  const { state } = useBundle();
  const planProducts = products.filter((p) => p.category === "plan");
  const items = getItemsForCategory(state.items, planProducts);
  const item = items[0];

  const isDesktop = useMediaQuery("(min-width: 1441px)");

  if (!item) return null;

  const product = planProducts.find((p) => p.id === item.productId);
  if (!product) return null;

  return (
    <>
      <p className="section-label" style={{ marginTop: "16px" }}>
        PLAN
      </p>
      <div className="plan-row">
        <div className="plan-brand">
          <img src={WyzeIcon} alt="Wayze icon" width={14} height={17} />
          <div className="plan-name">
            Cam <span className="accent">Unlimited</span>
          </div>
        </div>
        <PriceDisplay
          compareAtPrice={product.compareAtPrice}
          price={product.price}
          discountLabel={product.discountLabel}
          direction={isDesktop ? "row" : "column"}
          align="left"
          suffix="mo"
        />
      </div>
    </>
  );
}
