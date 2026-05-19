import { Menu } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
}

export default function Header({ isOpen, setIsOpen, title }: Props) {
  return (
    <header className="relative h-14 bg-gray-300 border-b px-4 flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-200 transition z-10"
      >
        <Menu size={24} className="text-teal-700" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 text-lg text-teal-700 font-medium">
        {title}
      </div>
    </header>
  );
}