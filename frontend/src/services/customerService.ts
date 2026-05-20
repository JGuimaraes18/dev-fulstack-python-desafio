import type { Customer } from "../types/Customer";
import { api } from "./api"

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>("/api/customers/");
  return response.data;
}
