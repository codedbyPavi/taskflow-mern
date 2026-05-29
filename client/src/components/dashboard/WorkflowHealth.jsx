import { AlertTriangle, Ban, Clock } from "lucide-react";
import { CardSkeleton } from "../ui/Skeleton";

const RING_CIRCUMFERENCE = 376.99;

const WorkflowHealth = ({ health, taskCount = 0, loading }) => {
  if (loading) {
    return (
      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const totalTasks = health?.totalTasks ?? taskCount ?? 0;
  const hasRealTasks = totalTasks > 0;
  const blockedCount = health?.blockedTasks ?? 0;
  const overdueCount = health?.overdueTasks ?? 0;
  const stuckCount = health?.stuckTasks ?? 0;
  const healthScore = hasRealTasks ? health?.healthScore ?? 0 : null;
  const dashOffset =
    healthScore != null ? RING_CIRCUMFERENCE - (healthScore / 100) * RING_CIRCUMFERENCE : RING_CIRCUMFERENCE;

  const statusLabel =
    healthScore == null
      ? null
      : healthScore >= 80
        ? "Excellent"
        : healthScore >= 60
          ? "Moderate"
          : "Needs attention";
  const statusClass =
    healthScore == null
      ? "bg-surface-alt text-gray-500 border-surface-border"
      : healthScore >= 80
        ? "bg-green-50 text-green-700 border-green-100"
        : healthScore >= 60
          ? "bg-[#FDF8EE] text-brand-700 border-accent-cream/50"
          : "bg-[#FDF3F0] text-brand-700 border-accent-peach/50";

  return (
    <section className="mb-12 animate-fade-up">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-500">Operational intelligence</p>
        <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight text-gray-900">Workflow health</h2>
        <p className="mt-2 max-w-lg text-sm text-gray-500">
          {hasRealTasks
            ? "A live read on how work is moving across your board."
            : "Add a real task to unlock workflow health insights."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Hero — Health score */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-surface-border bg-white p-10 text-center shadow-card transition-all duration-200 ease-in-out hover:shadow-card-lift lg:col-span-4">
          {!hasRealTasks && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
              <div className="h-72 w-72 rounded-full border-[48px] border-brand-500" />
            </div>
          )}
          {hasRealTasks && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
              <div className="h-72 w-72 rounded-full border-[48px] border-brand-500" />
            </div>
          )}
          <div className="relative mb-6 h-44 w-44">
            <svg className="h-44 w-44" viewBox="0 0 144 144" aria-hidden>
              <circle cx="72" cy="72" r="60" fill="none" stroke="#F0EDE8" strokeWidth="11" />
              {hasRealTasks && (
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  fill="none"
                  stroke="#48426D"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                  className="progress-ring-circle"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {hasRealTasks ? (
                <>
                  <span className="font-heading text-[44px] font-bold leading-none tracking-tight text-brand-500">
                    {healthScore}
                  </span>
                  <span className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">of 100</span>
                </>
              ) : (
                <span className="font-heading text-[40px] font-bold leading-none tracking-tight text-gray-300">—</span>
              )}
            </div>
          </div>
          <p className="mb-2 text-lg font-semibold text-gray-900">Health score</p>
          {hasRealTasks ? (
            <span className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold ${statusClass}`}>{statusLabel}</span>
          ) : (
            <>
              <span className="mb-3 rounded-full border border-surface-border bg-surface-alt px-4 py-1.5 text-[13px] font-semibold text-gray-500">
                N/A
              </span>
              <p className="max-w-[220px] text-[13px] leading-relaxed text-gray-500">
                Create your first real task to start tracking workflow health.
              </p>
            </>
          )}
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
          {/* Blocked — peach */}
          <div className="group flex flex-col rounded-3xl border border-accent-peach/30 bg-[#FDF3F0] p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-peach/30 transition-colors group-hover:bg-accent-peach/40">
                <Ban className="h-5 w-5 text-brand-600" />
              </div>
              {hasRealTasks && blockedCount > 0 && (
                <span className="rounded-full border border-accent-peach/40 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Needs action
                </span>
              )}
            </div>
            <p className="font-heading mb-1 text-[40px] font-bold leading-none tracking-tight text-brand-700">{blockedCount}</p>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-500/80">Blocked</p>
            <p className="mt-auto text-[13px] leading-relaxed text-gray-600">
              {!hasRealTasks
                ? "Sample task only — not counted in metrics."
                : blockedCount === 0
                  ? "Nothing is blocking progress right now."
                  : `${blockedCount} item${blockedCount > 1 ? "s" : ""} waiting to be unblocked.`}
            </p>
          </div>

          {/* Overdue — cream */}
          <div className="group flex flex-col rounded-3xl border border-accent-cream/40 bg-[#FDF8EE] p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-cream/35 transition-colors group-hover:bg-accent-cream/50">
                <AlertTriangle className="h-5 w-5 text-brand-600" />
              </div>
              {hasRealTasks && overdueCount > 0 && (
                <span className="rounded-full border border-accent-cream/50 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Past due
                </span>
              )}
            </div>
            <p className="font-heading mb-1 text-[40px] font-bold leading-none tracking-tight text-brand-700">{overdueCount}</p>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-500/80">Overdue</p>
            <p className="mt-auto text-[13px] leading-relaxed text-gray-600">
              {!hasRealTasks
                ? "Sample task only — not counted in metrics."
                : overdueCount === 0
                  ? "Every deadline is still on track."
                  : `${overdueCount} task${overdueCount > 1 ? "s" : ""} past their due date.`}
            </p>
          </div>

          {/* Stuck — light purple */}
          <div className="group flex flex-col rounded-3xl border border-brand-100 bg-brand-50 p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 transition-colors group-hover:bg-brand-200">
                <Clock className="h-5 w-5 text-brand-500" />
              </div>
              {hasRealTasks && stuckCount > 0 && (
                <span className="rounded-full border border-brand-200 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Review
                </span>
              )}
            </div>
            <p className="font-heading mb-1 text-[40px] font-bold leading-none tracking-tight text-brand-700">{stuckCount}</p>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-500/80">Stuck</p>
            <p className="mt-auto text-[13px] leading-relaxed text-gray-600">
              {!hasRealTasks
                ? "Sample task only — not counted in metrics."
                : stuckCount === 0
                  ? "Work is flowing without friction."
                  : `${stuckCount} task${stuckCount > 1 ? "s" : ""} idle in progress for 3+ days.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowHealth;
