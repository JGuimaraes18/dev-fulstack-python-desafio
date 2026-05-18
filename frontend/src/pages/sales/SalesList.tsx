import { useEffect, useState, useCallback, Fragment } from "react";
import { getSales, deleteSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getSellers } from "../../services/sellerService";
import type { Sale } from "../../types/Sale";
import type { Customer } from "../../types/Customer";
import type { Seller } from "../../types/Seller";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
  }, []);

  async function handleDelete(id: number) {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this sale?"
      );
      if (!confirmed) return;

      await deleteSale(id);
      await fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sale.");
    }
  }

  function toggleExpand(id: number) {
    setExpandedSaleId((prev) => (prev === id ? null : id));
  }

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const customerMap = new Map(
    customers.map((c) => [c.id, c.name])
  );

  const sellerMap = new Map(
    sellers.map((s) => [s.id, s.full_name])
  );

  if (loading) return <p className="p-4">Loading sales...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Nota Fiscal</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Data</th>
                <th className="p-3">Valor Total</th>
                <th className="p-3 text-center">Opções</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <Fragment key={sale.id}>
                  {/* LINHA PRINCIPAL */}
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{sale.invoice_number}</td>

                    <td className="p-3">
                      {customerMap.get(sale.customer) ?? "—"}
                    </td>

                    <td className="p-3">
                      {sellerMap.get(sale.seller) ?? "—"}
                    </td>

                    <td className="p-3">
                      {new Date(sale.date).toLocaleString("pt-BR")}
                    </td>

                    <td className="p-3 font-medium">
                      {currencyFormatter.format(sale.total_value)}
                    </td>

                    <td className="p-3 flex justify-center items-center gap-4">
                      {/* VER ITENS */}
                      <button
                        onClick={() => toggleExpand(sale.id)}
                        className="text-teal-700 flex items-center gap-1 hover:underline"
                      >
                        {expandedSaleId === sale.id ? (
                          <>
                            Fechar <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Ver itens <ChevronDown size={16} />
                          </>
                        )}
                      </button>

                      {/* EDITAR */}
                      <button
                        onClick={() => navigate(`/vendas/editar/${sale.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* LINHA EXPANDIDA */}
                  {expandedSaleId === sale.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-4">
                        <table className="w-full text-sm">
                          <thead className="text-gray-600 border-b">
                            <tr>
                              <th className="py-2 text-left">
                                Produto/Serviço
                              </th>
                              <th className="py-2 text-center">Qtd</th>
                              <th className="py-2 text-right">
                                Preço Unit.
                              </th>
                              <th className="py-2 text-right">Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {sale.items.map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2">
                                  {item.product_description}
                                </td>

                                <td className="py-2 text-center">
                                  {item.quantity}
                                </td>

                                <td className="py-2 text-right">
                                  {currencyFormatter.format(item.unit_price)}
                                </td>

                                <td className="py-2 text-right font-medium">
                                  {currencyFormatter.format(item.total_value)}
                                </td>
                              </tr>
                            ))}

                            <tr className="font-semibold">
                              <td colSpan={3} className="py-2 text-right">
                                Total da Venda:
                              </td>
                              <td className="py-2 text-right">
                                {currencyFormatter.format(
                                  sale.total_value
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}