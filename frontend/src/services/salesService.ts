import { api } from "./api";
import type { Sale, SaleCreatePayload } from "../types/Sale";

export async function getSales(): Promise<Sale[]> {
  const response = await api.get<Sale[]>("/sales/");
  return response.data;
}

export async function createSale(
  data: SaleCreatePayload
): Promise<Sale> {
  const response = await api.post<Sale>("/sales/", data);
  return response.data;
}

export async function updateSale(
  id: number,
  data: SaleCreatePayload
): Promise<Sale> {
  const response = await api.put<Sale>(`/sales/${id}/`, data);
  return response.data;
}

export async function deleteSale(id: number): Promise<void> {
  await api.delete(`/sales/${id}/`);
}