const Spinner = ({ className = "", size = "md" }) => {
  const sizes = { sm: "h-4 w-4 border", md: "h-5 w-5 border-2", lg: "h-10 w-10 border-2" };
  return (
    <div
      className={`animate-spin rounded-full border-[#E4E7EC] border-t-brand-500 ${sizes[size]} ${className}`}
    />
  );
};

export default Spinner;
