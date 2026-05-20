import { Menu, User } from "lucide-react";
import { getUser } from "../../services/authService";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
}

export default function Header({ isOpen, setIsOpen, title }: Props) {
  const user = getUser();

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between z-20 shadow-sm gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-teal-700 transition-colors shrink-0"
      >
        <Menu size={22} />
      </button>

      <div className="flex-1 text-center text-sm sm:text-base text-slate-800 font-bold tracking-wide truncate px-2">
        {title}
      </div>

      <div className="flex items-center gap-2 bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-100 shrink-0 max-w-[160px] sm:max-w-none">
        <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white shrink-0">
          <User size={12} />
        </div>
        <span className="text-xs font-medium text-slate-700 truncate">
          <span className="hidden xs:inline">Bem vindo, </span>
          {user?.first_name || user?.email}
        </span>
      </div>
    </header>
  );
}