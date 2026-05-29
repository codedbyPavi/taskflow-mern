const GlassCard = ({ children, className = "", hover = true, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-3xl border border-surface-border bg-white p-6 shadow-card transition-all duration-200 ease-in-out ${
      hover ? "hover:shadow-card-lift" : ""
    } ${onClick ? "cursor-pointer" : ""} ${className}`}
  >
    {children}
  </div>
);

export default GlassCard;
