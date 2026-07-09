import { useState } from "react";
import { useBundle } from "../../context/BundleContext";
import { saveToStorage } from "../../hooks/useLocalStorage";
import {
  calculateTotal,
  calculateCompareAtTotal,
  calculateSavings,
  getMonthlyTotal,
} from "../../utils/calculateTotal";
import productsData from "../../data/products.json";
import type { Product } from "../../types";
import { Button } from "../shared/Button";

import Badge from "../../assets/images/badge.png";
import { PriceDisplay } from "../shared/PriceDisplay";

const products = productsData as Product[];

export function ReviewPromoRow() {
  const { state } = useBundle();
  const [saved, setSaved] = useState(false);

  const total = calculateTotal(state.items, products);
  const compareAtTotal = calculateCompareAtTotal(state.items, products);
  const savings = calculateSavings(state.items, products);
  const monthlyTotal = getMonthlyTotal(state.items, products);

  const handleCheckout = () => {
    alert("This is a prototype, checkout isn't wired up yet.");
  };

  const handleSave = () => {
    saveToStorage(state);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="promo-row">
      <div className="promo-right">
        <div className="returns-price-container">
          <div className="returns-badge">
            <div className="returns-badge-image">
              <img
                src={Badge}
                alt="Savings badge"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div className="returns-badge-content">
              <p className="returns-badge-label">30-day hassle-free returns</p>
              <p className="returns-badge-description">
                If you're not totally in love with the product, we will refund
                you 100%.
              </p>
            </div>
          </div>

          <div className="price-summary">
            {monthlyTotal > 0 && (
              <div className="pill" aria-live="polite">
                as low as ${monthlyTotal.toFixed(2)} /mo
              </div>
            )}
            <PriceDisplay
              price={total}
              compareAtPrice={compareAtTotal}
              size="lg"
              direction="row"
            />
          </div>
        </div>

        {savings > 0 && (
          <div className="saving">
            Congrats! You&apos;re saving ${savings.toFixed(2)} on your security
            bundle!
          </div>
        )}
        <Button
          size="lg"
          buttonType="text"
          variant="primary"
          onClick={handleCheckout}
          className="checkout"
          style={{
            width: "100%",
          }}
        >
          Checkout
        </Button>
        <button
          onClick={handleSave}
          className="later"
          style={{ width: "100%", cursor: "pointer" }}
        >
          {saved ? "Saved!" : "Save my system for later"}
        </button>
      </div>
    </div>
  );
}
