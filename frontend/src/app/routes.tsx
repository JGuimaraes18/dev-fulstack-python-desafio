import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SalesPage from "../pages/sales/SalesPage";
import EditSale  from "../pages/sales/EditSale";
import CreateSale from "../pages/sales/CreateSale";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SalesPage />} />
          <Route path="/vendas/nova" element={<CreateSale />} />
          <Route path="/vendas/editar/:id" element={<EditSale />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}