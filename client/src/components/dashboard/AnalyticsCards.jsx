import { CheckCheck, CircleDashed, ClipboardList, Gauge } from "lucide-react";
import { filterRealTasks } from "../../utils/taskFilters";

const AnalyticsCards = ({ tasks }) => {
  const realTasks = filterRealTasks(tasks);
  const total = realTasks.length;
  const inProgress = realTasks.filter((task) => task.status === "in-progress").length;
  const completed = realTasks.filter((task) => task.status === "done").length;
  const productivity = total ? Math.round((completed / total) * 100) : 0;
  const tone = productivity >= 70 ? "text-brand-500" : productivity >= 40 ? "text-amber-600" : "text-gray-900";

  const cards = [
    { label: "Total tasks", value: total, icon: ClipboardList, iconBg: "bg-brand-50", iconColor: "text-brand-500" },
    { label: "In progress", value: inProgress, icon: CircleDashed, iconBg: "bg-[#FDF8EE]", iconColor: "text-brand-600" },
    { label: "Completed", value: completed, icon: CheckCheck, iconBg: "bg-green-50", iconColor: "text-success-500" },
    { label: "Completion", value: `${productivity}%`, icon: Gauge, iconBg: "bg-brand-50", iconColor: "text-brand-500", tone }
  ];

  return (
    <div className="mb-12 grid grid-cols-2 gap-6 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-3xl border border-surface-border bg-white p-6 shadow-card transition-all duration-200 ease-in-out hover:shadow-card-lift"
        >
          <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-2xl ${card.iconBg} transition-colors`}>
            <card.icon size={18} className={card.iconColor} />
          </div>
          <p className={`mb-1.5 font-heading text-[32px] font-bold leading-none tracking-tight ${card.tone || "text-gray-900"}`}>
            {card.value}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
