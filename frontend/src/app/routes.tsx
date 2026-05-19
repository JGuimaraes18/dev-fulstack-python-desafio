import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SalesPage from "../pages/sales/SalesPage";
import EditSale from "../pages/sales/EditSale";
import CreateSale from "../pages/sales/CreateSale";
import { ReactElement } from "react";

interface AppRoute {
  path: string;
  element: ReactElement;
  title: string;
}

const routes: AppRoute[] = [
  {
    path: "/",
    element: <SalesPage />,
    title: "Vendas",
  },
  {
    path: "/vendas/nova",
    element: <CreateSale />,
    title: "Nova Venda",
  },
  {
    path: "/vendas/editar/:id",
    element: <EditSale />,
    title: "Editar Venda",
  },
];

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout routes={routes} />}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}