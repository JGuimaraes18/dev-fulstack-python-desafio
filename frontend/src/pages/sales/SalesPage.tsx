import { useNavigate } from "react-router-dom";
import SalesList from "./SalesList";

export default function SalesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-base font-semibold text-teal-700">
          Vendas Realizadas
        </div>

        <button
          onClick={() => navigate(`/vendas/nova`)}
          className="bg-teal-700 text-white px-4 py-1 text-xs rounded hover:bg-teal-800"
        >
          Nova Venda
        </button>
      </div>

      <SalesList />
    </div>
  );
}