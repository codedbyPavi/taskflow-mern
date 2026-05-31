const ASSETS = {
  navbar: "/brand/taskflow-logo.svg",
  auth: "/brand/taskflow-logo-auth.svg",
  favicon: "/brand/favicon.svg"
};

const SIZES = {
  navbar: "h-9 w-9",
  auth: "h-12 w-12",
  sm: "h-10 w-10"
};

const RADIUS = {
  navbar: "rounded-xl",
  auth: "rounded-2xl",
  sm: "rounded-2xl"
};

const TaskFlowLogo = ({ variant = "navbar", className = "" }) => {
  const src = ASSETS[variant] || ASSETS.navbar;
  const size = SIZES[variant] || SIZES.navbar;
  const radius = RADIUS[variant] || RADIUS.navbar;

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`flex-shrink-0 object-contain ${size} ${radius} ${className}`.trim()}
    />
  );
};

export default TaskFlowLogo;
