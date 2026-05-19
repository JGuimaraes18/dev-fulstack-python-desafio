import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
}

export default function Header({ isOpen, setIsOpen, title }: Props) {
  const user = getUser();
  const navigate = useNavigate();

  return (
    <header className="relative h-14 bg-gray-300 border-b px-4 flex items-center justify-between">
      
      {/* menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-200 transition"
      >
        <Menu size={24} className="text-teal-700" />
      </button>

      {/* título central */}
      <div className="absolute left-1/2 -translate-x-1/2 text-lg text-teal-700 font-medium">
        {title}
      </div>

      {/* auth area */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-gray-700">{user.email}</span>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-xs px-2 py-1 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}