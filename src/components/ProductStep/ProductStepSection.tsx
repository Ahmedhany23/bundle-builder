import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";

type ProductStepSectionProps = {
  products: Product[];
};

export function ProductStepSection({ products }: ProductStepSectionProps) {
  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}