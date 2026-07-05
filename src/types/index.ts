export type Variant = {
  id: string;
  name: string;
  path: string; 
};

export type ProductCategory = "camera" | "sensor" | "accessory" | "plan";

export type Product = {
  id: string;
  category: ProductCategory;
  title: string
  description: string
  image: string
  learnMoreUrl: string
  price: number
  compareAtPrice: number
  discountLabel: string
  variants: Variant[]
  required: boolean
  minQuantity: number
  maxQuantity: number
};

export type SelectedItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

export type BundleState = {
  items: SelectedItem[];
};

export type StepConfig = {
  stepNumber: number;
  title: string;
  category: ProductCategory;
  icon: string; // icon name or component key
};