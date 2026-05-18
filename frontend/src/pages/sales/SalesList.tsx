import { useEffect, useState } from "react";
import { getSales, deleteSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getSellers } from "../../services/sellerService";
import type { Sale } from "../../types/Sale";
import type { Customer } from "../../types/Customer";
import type { Seller } from "../../types/Seller";

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    try {
      const [salesData, customersData, sellersData] = await Promise.all([
        getSales(),
        getCustomers(),
        getSellers(),
      ]);

      setSales(salesData);
      setCustomers(customersData);
      setSellers(sellersData);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this sale?")) return;

    await deleteSale(id);
    fetchAll();
  }

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔹 Mapas para lookup rápido
  const customerMap = new Map(
    customers.map((c) => [c.id, c.name])
  );

  const sellerMap = new Map(
    sellers.map((s) => [s.id, s.full_name])
  );

  if (loading) return <p className="p-4">Loading sales...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse flex-column">
          <thead className="bg-gray-50 text-sm text-black/70 flex-row justify-center">
            <tr className="border-b">
              <th className="p-2">Nota Fiscal</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Opções</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-2">{sale.invoice_number}</td>

                <td className="p-2">
                  {customerMap.get(sale.customer) ?? "—"}
                </td>

                <td className="p-2">
                  {sellerMap.get(sale.seller) ?? "—"}
                </td>

                <td className="p-2">
                  {new Date(sale.date).toLocaleString()}
                </td>

                <td className="p-2">
                  {sale.total_value.toFixed(2)}
                </td>

                <td className="p-2 text-right flex justify-center gap-3">
                  <button className="text-teal-700 hover:underline">
                    Ver itens
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}