export interface SaleItem {
  id: number;
  product: number;
  product_description: string;
  quantity: number;
  unit_price: number;
  total_value: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  date: string;
  customer: number;
  seller: number;
  items: SaleItem[];
  total_value: number;
}

export interface SaleCreatePayload {
  customer: number;
  seller: number;
}