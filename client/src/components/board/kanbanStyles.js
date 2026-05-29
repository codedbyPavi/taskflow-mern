export const COLUMN_STYLES = {
  todo: {
    track: "bg-slate-100/80",
    topBorder: "border-t-slate-300",
    dot: "bg-slate-400",
    label: "bg-slate-100 text-slate-600 border-slate-200"
  },
  "in-progress": {
    track: "bg-[#FDF8EE]/90",
    topBorder: "border-t-accent-cream",
    dot: "bg-accent-cream",
    label: "bg-[#FDF8EE] text-brand-700 border-accent-cream/40"
  },
  blocked: {
    track: "bg-[#FDF3F0]/90",
    topBorder: "border-t-accent-peach",
    dot: "bg-accent-peach",
    label: "bg-[#FDF3F0] text-brand-700 border-accent-peach/50"
  },
  done: {
    track: "bg-green-50/80",
    topBorder: "border-t-success-500",
    dot: "bg-success-500",
    label: "bg-green-50 text-green-700 border-green-100"
  }
};

export const getColumnStyle = (columnId) =>
  COLUMN_STYLES[columnId] || {
    track: "bg-surface-alt/80",
    topBorder: "border-t-surface-border",
    dot: "bg-gray-400",
    label: "bg-gray-50 text-gray-600 border-gray-200"
  };
