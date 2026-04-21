export type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
  barcode?: string;
  stock?: number;
  image?: string;
  taxRate?: number;
};
