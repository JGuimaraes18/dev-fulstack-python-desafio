import { useNavigate } from "react-router-dom";
import SalesList from "./SalesList";

export default function SalesPage() {

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Vendas Realizadas
        </h2>

        <button
          onClick={() => navigate(`/vendas/nova`)}
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
        >
          Inserir nova Venda
        </button>
      </div>

      <SalesList />

    </div>
  );
}