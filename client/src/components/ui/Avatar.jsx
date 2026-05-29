const Avatar = ({ name = "", size = "md", className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizes = { sm: "h-7 w-7 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-500 ${sizes[size]} ${className}`}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;
