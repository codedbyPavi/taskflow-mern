const PRIORITY_STYLES = {
  high: "bg-rose-50 text-rose-600 border-rose-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-gray-100 text-gray-500 border-gray-200",
  success: "bg-green-50 text-green-700 border-green-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-rose-50 text-rose-600 border-rose-100",
  info: "bg-gray-100 text-gray-600 border-gray-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200"
};

const Badge = ({ children, variant = "neutral", className = "", priority }) => {
  const key = priority || variant;
  const style = PRIORITY_STYLES[key?.toLowerCase?.()] || PRIORITY_STYLES[key] || PRIORITY_STYLES.neutral;
  const isPriority = ["high", "medium", "low"].includes(String(key).toLowerCase());

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${style} ${className}`}
    >
      {isPriority && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
};

export default Badge;
