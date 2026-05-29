const variants = {
  primary:
    "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-1 border border-transparent",
  secondary:
    "bg-white border border-surface-border hover:border-brand-200 text-gray-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-100",
  ghost:
    "bg-transparent text-gray-600 hover:text-brand-500 hover:bg-brand-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-100",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
};

const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold transition-all duration-200 ease-in-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
