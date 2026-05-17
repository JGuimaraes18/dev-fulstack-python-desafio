import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SalesPage from "../pages/sales/SalesPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SalesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}