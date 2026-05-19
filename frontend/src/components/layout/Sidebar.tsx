import { NavLink } from "react-router-dom";
import { ChevronRight, Percent, ShoppingCart } from "lucide-react";

interface Props {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
  const baseClass =
    "text-xs flex items-center justify-between px-2 py-2 transition-all duration-200";

  const activeClass = "bg-slate-400 text-teal-900 font-semibold shadow";
  const inactiveClass =
    "text-teal-700 bg-white hover:bg-gray-200";

  const items = [
    { label: "Vendas", icones: ShoppingCart, to: "/" },
    { label: "Comissões", icones: Percent, to: "/comissoes" },
  ];

  return (
    <div
      className={`
        bg-slate-200 border-r 
        transition-all duration-300 
        ${isOpen ? "w-30" : "w-10"}
      `}
    >
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
              <item.icones size={16} />
              {isOpen && <span>{item.label}</span>}
            </div>

            {isOpen && (
              <ChevronRight
                size={16}
                className="text-gray-800"
              />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}