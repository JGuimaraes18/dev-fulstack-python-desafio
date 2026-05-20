import { api } from "./api"
import type { Seller } from "../types/Seller";

export async function getSellers(): Promise<Seller[]> {
  const response = await api.get<Seller[]>("/api/sellers/");
  return response.data;
}
