import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Sidebar() {
  const baseClass =
    "flex items-center justify-between px-3 py-3 transition-all duration-200 text-teal-700";

  const activeClass = "bg-teal-800 text-white";
  const inactiveClass =
    "text-gray-700 hover:bg-gray-100";

  const items = [
    { label: "Vendas", to: "/" },
    { label: "Comissões", to: "/commissions" },
  ];

  return (
    <div className="h-full bg-white border-r w-35 mt-12">
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${baseClass} ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            <span className="font-medium">{item.label}</span>

            <ChevronRight
              size={16}
              className="text-gray-400"
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}