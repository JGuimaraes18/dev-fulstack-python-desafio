import { api } from "./api";
import type { CommissionReport } from "../types/Commission";

export async function getCommissionReport(startDate: string, endDate: string): Promise<CommissionReport[]> {
  const response = await api.get<CommissionReport[]>("/commissions/", {
    params: {
      start_date: startDate,
      end_date: endDate
    }
  });
  return response.data;
}