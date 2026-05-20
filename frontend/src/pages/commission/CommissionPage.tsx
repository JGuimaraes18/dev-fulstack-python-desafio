import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { getCommissionReport } from "../../services/commissionService";
import type { CommissionReport } from "../../types/Commission";

export default function CommissionPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<CommissionReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dateError, setDateError] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setDateError(true);
      return;
    }

    setDateError(false);

    setLoading(true);
    try {
      const data = await getCommissionReport(startDate, endDate);
      setReportData(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Erro ao buscar comissões:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalComissoes = reportData.reduce(
    (acc, curr) => acc + Number(curr.total_commission), 
    0
  );

  const sortedCommissions = useMemo(() => {
    return [...reportData].sort((a, b) => {
      return Number(b.seller_id) - Number(a.seller_id);
    });
  }, [reportData]);

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 border-b">
        <div className="text-base font-bold text-teal-800 italic">Relatório de Comissões</div>
        
        <div className="flex gap-2 items-end mt-2 md:mt-0 mb-2">
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase">Data Inicial</label>
            <input 
              type="date" 
              className={`border-b outline-none transition-colors p-1 text-xs text-gray-700
                [&::-webkit-calendar-picker-indicator]:invert-[0.5] 
                ${dateError && !startDate
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
                }
              `}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase">Data Final</label>
            <input 
              type="date" 
              className={`border-b outline-none transition-colors p-1 text-xs text-gray-700
                [&::-webkit-calendar-picker-indicator]:invert-[0.5] 
                ${dateError && !endDate
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
                }
              `}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-teal-800 text-white p-2 rounded-md hover:bg-teal-900 shadow-md transition-all active:scale-95"
          >
            <Search size={20} />
          </button>
        </div>
      </header>

      {!hasSearched ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
          <p className="italic text-lg">Selecione um período para gerar o relatório.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b">
                <th className="pb-2 w-24 text-center">Cód.</th>
                <th className="pb-2">Vendedor</th>
                <th className="pb-2 text-center">Quantidade Vendas</th>
                <th className="pb-2 text-center">Total Vendas</th>
                <th className="pb-2 text-right">Comissão Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 mb-4">
              {sortedCommissions.map((item) => (
                <tr key={item.seller_id} className="hover:bg-slate-50 transition-colors text-xs ">
                  <td className="py-2 text-center text-gray-500 font-mono">
                    {String(item.seller_id).padStart(4, '0')}
                  </td>
                  <td className="py-2 text-gray-700">{item.seller_name}</td>
                  <td className="py-2 text-center text-gray-600 ">{item.sale_count}</td>
                  <td className="py-2 text-center text-gray-600">
                    R$ {Number(item.total_sales).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 text-right font-bold text-gray-800">
                    R$ {Number(item.total_commission).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 text-[14px]">
                <td colSpan={5} className="py-6 font-medium text-black">
                  <div className="flex justify-end items-center w-full">
                    
                    <span className="font-black text-[14px] px-8">
                      Total de Comissões do Período ({startDate} a {endDate}):
                    </span>

                    <span className="font-black text-teal-900 text-[16px]">
                      R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>

                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          
          {reportData.length === 0 && (
            <p className="text-center py-10 text-gray-500">Nenhuma venda encontrada para este período.</p>
          )}
        </div>
      )}
    </div>
  );
}