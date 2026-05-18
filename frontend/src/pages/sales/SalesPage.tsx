import { useState } from "react";
import SalesList from "./SalesList";
import SalesForm from "./SalesForm";

export default function SalesPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Vendas Realizadas
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
        >
          Inserir nova Venda
        </button>
      </div>

      <SalesList key={refreshKey} />

      {showForm && (
        <SalesForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setRefreshKey((p) => p + 1)}
        />
      )}
    </div>
  );
}