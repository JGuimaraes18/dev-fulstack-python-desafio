import SaleForm from "../../components/layout/ui/SaleForm";
import { createSale } from "../../services/salesService";
import { useNavigate } from "react-router-dom";

export default function CreateSalePage() {
  const navigate = useNavigate();

  const handleCreate = async (payload: any) => {
    try {
      await createSale(payload);
      navigate("/", {
        state: {
        message: "Venda criada com sucesso!",
        type: "success"
        }
      });
    } catch (error) {
      navigate("/", {
        state: { 
        message: "Erro ao criar venda!",
        type: "error"
        }
      });
    }
  };

  return <SaleForm title="Nova Venda" onSave={handleCreate} />;
}