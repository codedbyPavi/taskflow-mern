import { Plus } from "lucide-react";
import Button from "./Button";

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex animate-fade-in flex-col items-center justify-center px-8 py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-border bg-surface shadow-xs">
      {Icon && <Icon className="h-7 w-7 text-gray-300" />}
    </div>
    <h3 className="mb-1.5 text-[15px] font-semibold tracking-tight text-gray-700">{title}</h3>
    <p className="mb-6 max-w-[240px] text-[13px] leading-relaxed text-gray-400">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>
        <Plus className="h-3.5 w-3.5" />
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
