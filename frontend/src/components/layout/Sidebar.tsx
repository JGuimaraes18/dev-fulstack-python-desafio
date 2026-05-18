import { NavLink } from "react-router-dom";
import { ChevronRight, Percent, ShoppingCart } from "lucide-react";

export default function Sidebar() {
  const baseClass =
    "flex items-center justify-between px-3 py-3 transition-all duration-200";

  const activeClass = "bg-slate-400 text-teal-900 font-bold shadow";
  const inactiveClass =
    "text-teal-700 bg-white hover:bg-gray-200";

  const items = [
    { label: "Vendas", icones: ShoppingCart, to: "/" },
    { label: "Comissões", icones: Percent , to: "/commissions" },
  ];

  return (
    <div className="bg-slate-200 border-r w-50">
      <nav className="space-y-2 py-2">
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
            <div className="flex items-center gap-3">
              <item.icones size={18} />
              <span>{item.label}</span>
            </div>

            <ChevronRight
              size={22}
              className="text-gray-400"
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}