import { useEffect, useState, useCallback, Fragment } from "react";
import { getSales, deleteSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getSellers } from "../../services/sellerService";
import type { Sale } from "../../types/Sale";
import type { Customer } from "../../types/Customer";
import type { Seller } from "../../types/Seller";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/layout/ui/ConfirmModal";

export default function SalesList() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      setError("Erro ao carregar vendas.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleDeleteConfirmed() {
    if (!saleToDelete) return;

    try {
      await deleteSale(saleToDelete);
      navigate("/", {
        state: {
          message: "Venda excluída com sucesso!",
          type: "success"
         }
      });
    } catch (err) {
      console.error(err);
      navigate("/", {
        state: { 
          message: "Venda excluída com sucesso!",
          type: "error"
         }
      });
    } finally {
      setIsModalOpen(false);
      setSaleToDelete(null);
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

  if (loading) return <p className="p-4">Carregando vendas...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="max-h-[80vh] overflow-y-auto custom-scroll">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Nota Fiscal</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Vendedor</th>
                <th className="p-2 text-center">Data</th>
                <th className="p-2 text-center">Valor Total</th>
                <th className="p-2 text-center">Opções</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <Fragment key={sale.id}>
                  <tr className="border-b hover:bg-slate-50 transition-colors text-gray-700 text-xs">
                    <td className="p-2 font-mono">{sale.invoice_number}</td>

                    <td className="p-2">
                      {customerMap.get(sale.customer) ?? "—"}
                    </td>

                    <td className="p-2">
                      {sellerMap.get(sale.seller) ?? "—"}
                    </td>

                    <td className="text-center">
                      {new Date(sale.date).toLocaleString("pt-BR")}
                    </td>

                    <td className="p-2 text-center font-medium">
                      {currencyFormatter.format(sale.total_value)}
                    </td>

                    <td className="p-3 flex justify-center items-center gap-4">
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

                      <button
                        onClick={() => navigate(`/vendas/editar/${sale.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => {
                          setSaleToDelete(sale.id);
                          setIsModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>

                  {expandedSaleId === sale.id && (
                    <tr className="bg-slate-100">
                      <td colSpan={6} className="p-6">
                        <table className="w-full text-xs text-gray-500">
                          <thead className="border-b">
                            <tr>
                              <th className="py-2 w-[55%] text-left font-semibold">
                                Produto/Serviço
                              </th>
                              <th className="py-2 w-[15%] text-center font-semibold">Quantidade</th>
                              <th className="py-2 w-[15%] text-center font-semibold">
                                Preço Unit.
                              </th>
                              <th className="py-2 w-[15%] text-right font-semibold">Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {sale.items.map((item) => (
                              <tr key={item.id} className="border-b text-xs">
                                <td className="py-1 px-3">
                                  {item.product_description}
                                </td>

                                <td className="py-1 text-center">
                                  {item.quantity}
                                </td>

                                <td className="py-1 text-center">
                                  {currencyFormatter.format(item.unit_price)}
                                </td>

                                <td className="py-1 text-right">
                                  {currencyFormatter.format(item.total_value)}
                                </td>
                              </tr>
                            ))}

                            <tr className="text-[14px] font-bold">
                              <td colSpan={4} className="py-2 text-right px-8">
                                Total da Venda:
                              </td>
                              <td className="py-2 text-right text-teal-900">
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
      {isModalOpen && (
        <ConfirmModal
          isOpen={isModalOpen}
          title="Excluir Venda"
          message="Deseja excluir esta venda?"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => {
            setIsModalOpen(false);
            setSaleToDelete(null);
          }}
        />
      )}  
    </>
  );
}