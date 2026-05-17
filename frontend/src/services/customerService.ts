import type { Customer } from "../types/Customer";
import { api } from "./api"

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>("/customers/");
  console.log(response);
  return response.data;
}
