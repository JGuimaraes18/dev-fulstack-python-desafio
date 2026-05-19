import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight, Percent, ShoppingCart, LogOut } from "lucide-react";
import { isAdmin, logout } from "../../services/authService";

interface Props {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: Props) {
  const navigate = useNavigate();

  const baseClass =
    "text-xs flex items-center justify-between px-2 py-2 transition-all duration-200";

  const activeClass = "bg-slate-400 text-teal-900 font-semibold shadow";
  const inactiveClass = "text-teal-700 bg-white hover:bg-gray-200";

  const items = [
    { label: "Vendas", icones: ShoppingCart, to: "/" },
    ...(isAdmin()
      ? [{ label: "Comissões", icones: Percent, to: "/comissoes" }]
      : []),
  ];

  return (
    <div
      className={`
        bg-slate-200 border-r
        transition-all duration-300
        ${isOpen ? "w-30" : "w-10"}
        flex flex-col h-full
      `}
    >
      
      <nav className="flex flex-col flex-1 py-2 space-y-2">
        {/* LINKS */}
        <div className="space-y-2">
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
                <ChevronRight size={16} className="text-gray-800" />
              )}
            </NavLink>
          ))}
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-auto text-xs flex items-center gap-2 px-2 py-2 bg-white text-teal-700 rounded hover:bg-teal-800 hover:text-white transition"
        >
          <LogOut size={16} />
          {isOpen && <span>Sair</span>}
        </button>
      </nav>
    </div>
  );
}