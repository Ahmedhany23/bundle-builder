import type { Product } from "../../types";
import { useBundle } from "../../context/BundleContext";
import { Button } from "../shared/Button";
import { useIsDesktop } from "../../context/MediaQueryContext";

import MinusIcon from "../../assets/icons/minus-icon.svg";
import PlusIcon from "../../assets/icons/add-icon.svg";
import { PriceDisplay } from "../shared/PriceDisplay";

type ReviewLineItemProps = {
  product: Product;
  variantId?: string;
  quantity: number;
};

export function ReviewLineItem({
  product,
  variantId,
  quantity,
}: ReviewLineItemProps) {
  const { dispatch } = useBundle();
  const isDesktop = useIsDesktop();
  const decrementTooltipId = `review-decrement-tip-${product.id}`;

  const handleChange = (next: number) => {
    dispatch({
      type: "SET_QUANTITY",
      productId: product.id,
      variantId,
      quantity: next,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity,
      required: product.required,
    });
  };

  const lineTotal = product.price * quantity;
  const lineCompareAt =
    product.compareAtPrice != null ? product.compareAtPrice * quantity : null;

  const variantName = product.variants.find((v) => v.id === variantId)?.name;

  return (
    <div className="line-item">
      <div className="product">
        <div className="thumb">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            width={41}
            height={41}
          />
        </div>
        <p className="product-name">
          {product.title}{" "}
          {variantName && <span>({variantName})</span>}{" "}
        </p>
      </div>
      <div className="line-item-right">
        <div className="qty">
          {/* Hidden tooltip read by screen readers to explain why decrement is locked */}
          {product.required && (
            <span id={decrementTooltipId} className="sr-only">
              {product.title} is required and cannot be removed.
            </span>
          )}
          <Button
            buttonType="icon"
            variant="decrement"
            size="sm"
            ariaLabel={`Decrease quantity for ${product.title}`}
            aria-describedby={product.required ? decrementTooltipId : undefined}
            icon={
              <img
                src={MinusIcon}
                alt="Minus icon"
                loading="lazy"
                width={8}
                height={10}
              />
            }
            onClick={() => handleChange(quantity - 1)}
            style={{ background: "white" }}
            disabled={product.required || quantity <= product.minQuantity}
            title={
              product.required
                ? "This item is required and cannot be removed."
                : undefined
            }
          />
          <span className="count">{quantity}</span>
          <Button
            buttonType="icon"
            variant="increment"
            size="sm"
            ariaLabel={`Increase quantity for ${product.title}`}
            icon={
              <img
                src={PlusIcon}
                alt="Plus icon"
                loading="lazy"
                width={8}
                height={8}
              />
            }
            onClick={() => handleChange(quantity + 1)}
            style={{ background: "white" }}
            disabled={quantity >= product.maxQuantity}
          />
        </div>

        <PriceDisplay
          compareAtPrice={lineCompareAt}
          price={lineTotal}
          discountLabel={product.discountLabel}
          direction={isDesktop ? "row" : "column"}
          align="left"
        />
      </div>
    </div>
  );
}
