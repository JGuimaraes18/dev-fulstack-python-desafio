import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const baseClass =
    "block px-4 py-2 rounded-lg transition-colors duration-200";

  const activeClass = "bg-blue-600 text-white";
  const inactiveClass =
    "text-gray-700 hover:bg-blue-100 hover:text-blue-600";

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-8 text-blue-600">
        Sales Control
      </h2>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          Vendas
        </NavLink>

        <NavLink
          to="/commissions"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive ? activeClass : inactiveClass
            }`
          }
        >
          Comissões
        </NavLink>
      </nav>
    </aside>
  );
}