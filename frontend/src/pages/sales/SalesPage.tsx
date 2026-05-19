import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SalesList from "./SalesList";

export default function SalesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | "warning">("success");

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setType(location.state.type || "success");

      window.history.replaceState({}, document.title);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, [location]);

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

      {message && (
        <div
          className={`ml-auto w-fit max-w-sm px-4 py-2 rounded-md text-sm border ${
            type === "error"
              ? "bg-red-100 border-red-300 text-red-800"
              : type === "warning"
              ? "bg-yellow-100 border-yellow-300 text-yellow-800"
              : "bg-green-100 border-green-300 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
      <SalesList />
    </div>
  );
}