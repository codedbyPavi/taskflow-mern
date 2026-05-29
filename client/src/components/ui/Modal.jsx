import { X } from "lucide-react";

const Modal = ({ open, title, subtitle, onClose, children, className = "", footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div
        className={`relative animate-scale-in w-full max-w-lg rounded-3xl border border-surface-border bg-white shadow-modal ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-subtle px-8 pb-5 pt-7">
          <div>
            <h2 className="text-[18px] font-bold tracking-tight text-gray-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[13px] text-gray-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-5 px-8 py-6">{children}</div>
        {footer}
      </div>
    </div>
  );
};

export default Modal;
