import ShippingIcon from "../../assets/icons/shipping-icon.svg";
import { PriceDisplay } from "../shared/PriceDisplay";

export function ReviewShippingRow() {
  return (
    <div className="shipping">
      <div className="shipping-left">
        <div className="shipping-icon" aria-hidden="true">
          <img src={ShippingIcon} alt="Shipping icon" />
        </div>
        <p className="product-name">Fast Shipping</p>
      </div>

      <PriceDisplay discountLabel="FREE" compareAtPrice={5.99} price={0} direction="row" />

    </div>
  );
}
