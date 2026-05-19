import { Menu } from "lucide-react";
import { getUser } from "../../services/authService";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
}

export default function Header({ isOpen, setIsOpen, title }: Props) {
  const user = getUser();

  return (
    <header className="relative h-14 bg-gray-300 border-b px-4 flex items-center justify-between">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-200 transition"
      >
        <Menu size={24} className="text-teal-700" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 text-lg text-teal-700 font-medium">
        {title}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-700">Bem vindo, {user.first_name} </span>
      </div>
    </header>
  );
}