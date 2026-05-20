import type { Product } from "../types/Product";
import { api } from "./api"

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/api/products/");
  return response.data;
}