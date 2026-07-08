import { useBundle } from "../../context/BundleContext";
import { getQuantity } from "../../utils/selectors";
import type { Product } from "../../types";
import { useSelectedVariant } from "../../hooks/useSelectedVariant";
import { Button } from "../shared/Button";

import PlusIcon from "../../assets/icons/add-icon.svg";
import MinusIcon from "../../assets/icons/minus-icon.svg";
import { PriceDisplay } from "../shared/PriceDisplay";
import { useMediaQuery } from "../../hooks/useMediaQuery";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useBundle();
  const { activeVariantId, setActiveVariantId } = useSelectedVariant(product);

  const isDesktop = useMediaQuery("(min-width: 1441px)");

  const quantity = getQuantity(state.items, product.id, activeVariantId);
  const isSelected = quantity > 0;

  const isPlan = product.category === "plan";

  const handleChange = (next: number) => {
    dispatch({
      type: "SET_QUANTITY",
      productId: product.id,
      variantId: activeVariantId,
      quantity: next,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity,
    });
  };

  const hasVariants = !!product.variants && product.variants.length > 0;

  return (
    <article className={`product-card ${isSelected ? "selected" : ""}`}>
      <div className="product-top">
        {product.discountLabel && (
          <span className="save-badge">{product.discountLabel}</span>
        )}
      </div>

      <div className="product-media">
        <img src={product.image} alt={product.title} loading="lazy" width={713} />
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>

        {product.description && (
          <p className="product-copy">
            {product.description}{" "}
            {product.learnMoreUrl && (
              <a href={product.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
            )}
          </p>
        )}

        {hasVariants && (
          <div className="swatches">
            {product.variants!.map((variant) => (
              <Button
                key={variant.id}
                buttonType="textWithIcon"
                variant="default"
                size="sm"
                onClick={() => setActiveVariantId(variant.id)}
                iconPosition="left"
                icon={
                  <img
                    src={
                      new URL(
                        `../../assets/images/${variant.path}`,
                        import.meta.url,
                      ).href
                    }
                    loading="lazy"
                    width={28}
                  />
                }
                className={` ${activeVariantId === variant.id ? "selected" : ""}`}
              >
                {variant.name}
              </Button>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className="product-controls">
            {!isPlan ? (
              <>
                <Button
                  buttonType="icon"
                  variant="decrement"
                  size="sm"
                  ariaLabel={`Decrease quantity for ${product.title}`}
                  icon={<img src={MinusIcon} alt="Minus icon" loading="lazy" width={8} height={10} />}
                  onClick={() => handleChange(quantity - 1)}
                  disabled={quantity <= product.minQuantity}
                />
                <span className="count">{quantity}</span>
                <Button
                  buttonType="icon"
                  variant="increment"
                  size="sm"
                  ariaLabel={`Increase quantity for ${product.title}`}
                  icon={<img src={PlusIcon} alt="Plus icon" loading="lazy" width={8} height={8} />}
                  onClick={() => handleChange(quantity + 1)}
                  disabled={quantity >= product.maxQuantity}
                />
              </>
            ) : (
              <Button
                buttonType="text"
                variant="primary"
                size="md"
                onClick={() =>
                  quantity === 0
                    ? handleChange(quantity + 1)
                    : handleChange(quantity - 1)
                }
              >
                {quantity === 0 ? "Add" : "Remove"}
              </Button>
            )}
          </div>

          <PriceDisplay
            price={+product.price.toFixed(2)}
            compareAtPrice={product.compareAtPrice}
            discountLabel={product.discountLabel}
            compareColor="#D8392B"
            activeColor="#575757"
            direction={isPlan ? "column" : isDesktop ? "row" : "column"}
            suffix={isPlan ? " /mo" : ""}
          />
        </div>
      </div>
    </article>
  );
}
