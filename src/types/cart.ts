export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  tax?: number;
  discount?: number;
}
