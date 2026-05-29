const Input = ({ label, className = "", wrapperClassName = "", ...props }) => {
  const inputEl = (
    <input
      className={`h-11 w-full rounded-xl border border-surface-border bg-white px-4 text-[14px] text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-gray-400 ${className}`}
      {...props}
    />
  );

  if (!label) return inputEl;

  return (
    <div className={`space-y-1.5 ${wrapperClassName}`}>
      <label className="block text-[11px] font-bold uppercase tracking-[0.07em] text-gray-400">{label}</label>
      {inputEl}
    </div>
  );
};

export default Input;
