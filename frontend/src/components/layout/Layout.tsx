import { useState } from "react";
import {
  Outlet,
  useLocation,
  matchPath,
} from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppRoute {
  path: string;
  element: React.ReactElement;
  title: string;
}

interface Props {
  routes: AppRoute[];
}

export default function Layout({ routes }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const currentRoute = routes.find((route) =>
    matchPath(
      { path: route.path, end: true },
      location.pathname
    )
  );

  const title = currentRoute?.title || "Dashboard";

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Header
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isOpen} />

        <main className="flex-1 overflow-y-auto p-4 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}