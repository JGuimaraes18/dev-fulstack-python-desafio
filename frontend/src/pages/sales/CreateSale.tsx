import SaleForm from "../../components/layout/ui/SaleForm";
import { createSale } from "../../services/salesService";
import { useNavigate } from "react-router-dom";

export default function CreateSalePage() {
  const navigate = useNavigate();

  const handleCreate = async (payload: any) => {
    try {
      await createSale(payload);
      alert("Venda criada com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao criar venda.");
    }
  };

  return <SaleForm title="Nova Venda" onSave={handleCreate} />;
}