import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[350px] shadow-xl p-4 animate-fadeIn">

        <div className="flex justify-between items-center mb-8">
          <label className="text-xl font-bold text-black">{title}</label>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-black">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-4 py-1 rounded-lg bg-white border border-teal-600 text-teal-700 font-medium hover:bg-gray-300"
          >
            Não
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-1 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-900"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}