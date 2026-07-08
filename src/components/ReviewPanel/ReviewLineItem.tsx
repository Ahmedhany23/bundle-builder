import type { Product } from "../../types";
import { useBundle } from "../../context/BundleContext";
import { Button } from "../shared/Button";

import MinusIcon from "../../assets/icons/minus-icon.svg";
import PlusIcon from "../../assets/icons/add-icon.svg";
import { PriceDisplay } from "../shared/PriceDisplay";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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

  const isDesktop = useMediaQuery("(min-width: 1441px)");

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
          />
        </div>
        <p className="product-name">
          {product.title}{" "}
          <span hidden={!variantName}>({variantName})</span>{" "}
        </p>
      </div>
      <div className="line-item-right">
        <div className="qty">
          <Button
            buttonType="icon"
            variant="decrement"
            size="sm"
            ariaLabel={`Decrease quantity for ${product.title}`}
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
