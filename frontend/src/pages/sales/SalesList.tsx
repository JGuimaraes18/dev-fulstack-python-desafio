import { useEffect, useState, useCallback, useMemo, Fragment } from "react";
import { getSales, deleteSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getSellers } from "../../services/sellerService";
import type { Sale } from "../../types/Sale";
import type { Customer } from "../../types/Customer";
import type { Seller } from "../../types/Seller";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../components/layout/ui/ConfirmModal";
import { getUser } from "../../services/authService";

interface SalesListProps {
  searchTerm: string;
}

export default function SalesList({ searchTerm }: SalesListProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const user = getUser();
  const isSeller = user?.groups?.includes("SELLER");

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
          message: "Erro ao excluir a venda.",
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

  const customerMap = useMemo(() => new Map(
    customers.map((c) => [c.id, c.name])
  ), [customers]);

  const sellerMap = useMemo(() => new Map(
    sellers.map((s) => [s.id, s.full_name])
  ), [sellers]);

  const filteredAndSortedSales = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();

    if (!searchLower) {
      return [...sales].sort((a, b) => Number(b.invoice_number) - Number(a.invoice_number));
    }

    return sales
      .filter((sale) => {
        const customerName = customerMap.get(sale.customer)?.toLowerCase() || "";
        const sellerName = sellerMap.get(sale.seller)?.toLowerCase() || "";
        const invoiceNumber = String(sale.invoice_number).toLowerCase();
        const saleDate = new Date(sale.date).toLocaleString("pt-BR").toLowerCase();

        return (
          customerName.includes(searchLower) ||
          sellerName.includes(searchLower) ||
          invoiceNumber.includes(searchLower) ||
          saleDate.includes(searchLower)
        );
      })
      .sort((a, b) => Number(b.invoice_number) - Number(a.invoice_number));
  }, [sales, searchTerm, customerMap, sellerMap]);

  if (loading) return <p className="p-4 text-xs">Carregando vendas...</p>;
  if (error) return <p className="p-4 text-xs text-red-500">{error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <div className="max-h-[80vh] overflow-y-auto custom-scroll">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
              <tr>
                <th className="p-2 w-[12%]">Nota Fiscal</th>
                <th className="p-2 w-[28%]">Cliente</th>
                <th className="p-2 w-[25%]">Vendedor</th>
                <th className="p-2 text-center w-[15%]">Data</th>
                <th className="p-2 text-center w-[10%]">Valor Total</th>
                <th className="p-2 text-center w-[10%]">Opções</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                    Nenhuma venda encontrada para o termo pesquisado.
                  </td>
                </tr>
              ) : (
                filteredAndSortedSales.map((sale) => (
                  <Fragment key={sale.id}>
                    <tr className="border-b hover:bg-slate-50 transition-colors text-gray-700 text-xs">
                      <td className="p-2 font-mono">{sale.invoice_number}</td>

                      <td className="p-2 truncate" title={customerMap.get(sale.customer)}>
                        {customerMap.get(sale.customer) ?? "—"}
                      </td>

                      <td className="p-2 truncate" title={sellerMap.get(sale.seller)}>
                        {sellerMap.get(sale.seller) ?? "—"}
                      </td>

                      <td className="text-center p-2">
                        {new Date(sale.date).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                      </td>

                      <td className="p-2 text-center font-medium">
                        {currencyFormatter.format(sale.total_value)}
                      </td>

                      <td className="p-2 flex justify-center items-center gap-3">
                        <button
                          onClick={() => toggleExpand(sale.id)}
                          className="text-teal-700 flex items-center gap-0.5 hover:underline"
                        >
                          {expandedSaleId === sale.id ? (
                            <>
                              Fechar <ChevronUp size={14} />
                            </>
                          ) : (
                            <>
                              Itens <ChevronDown size={14} />
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => !isSeller && navigate(`/vendas/editar/${sale.id}`)}
                          disabled={isSeller}
                          className={`${
                            isSeller
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-blue-600 hover:text-blue-800"
                          }`}
                          title="Editar venda"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => {
                            if (isSeller) return;
                            setSaleToDelete(sale.id);
                            setIsModalOpen(true);
                          }}
                          disabled={isSeller}
                          className={`${
                            isSeller
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-600 hover:text-red-800"
                          }`}
                          title="Excluir venda"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>

                    {expandedSaleId === sale.id && (
                      <tr className="bg-slate-50">
                        <td colSpan={6} className="p-4 border-b">
                          <div className="bg-white rounded border border-gray-200 p-3 shadow-inner">
                            <table className="w-full text-xs text-gray-600 table-fixed">
                              <thead className="border-b bg-gray-50 text-gray-500">
                                <tr>
                                  <th className="py-1.5 px-2 w-[55%] text-left font-semibold">
                                    Produto/Serviço
                                  </th>
                                  <th className="py-1.5 w-[15%] text-center font-semibold">Qtd</th>
                                  <th className="py-1.5 w-[15%] text-center font-semibold">
                                    Preço Unit.
                                  </th>
                                  <th className="py-1.5 px-2 w-[15%] text-right font-semibold">Total</th>
                                </tr>
                              </thead>

                              <tbody>
                                {sale.items.map((item) => (
                                  <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="py-1.5 px-2 truncate">
                                      {item.product_description}
                                    </td>

                                    <td className="py-1.5 text-center">
                                      {item.quantity}
                                    </td>

                                    <td className="py-1.5 text-center">
                                      {currencyFormatter.format(item.unit_price)}
                                    </td>

                                    <td className="py-1.5 px-2 text-right font-medium">
                                      {currencyFormatter.format(item.total_value)}
                                    </td>
                                  </tr>
                                ))}

                                <br />
                                <tr className="text-xs font-bold text-gray-800">
                                  {/* Corrigido para colSpan 3 para alinhar perfeitamente à direita */}
                                  <td colSpan={3} className="py-2 text-right pr-4">
                                    Total da Venda:
                                  </td>
                                  <td className="py-2 pr-2 text-right text-teal-700 text-sm">
                                    {currencyFormatter.format(sale.total_value)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
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