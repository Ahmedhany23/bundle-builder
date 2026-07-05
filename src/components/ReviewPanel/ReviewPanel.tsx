import { ReviewSection } from "./ReviewSection";
import { ReviewPlanRow } from "./ReviewPlanRow";
import { ReviewShippingRow } from "./ReviewShippingRow";
import { ReviewPromoRow } from "./ReviewPromoRow";
import { getItemsForCategory } from "../../utils/selectors";
import productsData from "../../data/products.json";
import type { Product, ProductCategory } from "../../types";
import { useBundle } from "../../context/BundleContext";

const products = productsData as Product[];

const CATEGORY_LABELS: Record<Exclude<ProductCategory, "plan">, string> = {
  camera: "CAMERAS",
  sensor: "SENSORS",
  accessory: "ACCESSORIES",
};

export function ReviewPanel() {
  const { state } = useBundle();
  const categories: Exclude<ProductCategory, "plan">[] = [
    "camera",
    "sensor",
    "accessory",
  ];

  return (
    <section className="review">
      <p className="review-kicker">REVIEW</p>
      <div className="review-card">
        <div className="review-card-left">
          <h2 className="review-title">Your security system</h2>
          <p className="review-copy">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
          <hr className="divider" />

          {categories.map((category, idx) => {
            const categoryProducts = products.filter(
              (p) => p.category === category,
            );
            const items = getItemsForCategory(state.items, categoryProducts);
            if (items.length === 0) return null;

            return (
              <ReviewSection
                key={category}
                label={CATEGORY_LABELS[category]}
                items={items}
                categoryProducts={categoryProducts}
                withTopMargin={idx > 0}
              />
            );
          })}
          <ReviewPlanRow />
          <ReviewShippingRow />
        </div>
        <div className="review-card-right">
          <ReviewPromoRow />
        </div>
      </div>
    </section>
  );
}
