import { useEffect, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  AlertTriangle,
  Ban,
  BarChart2,
  CheckCheck,
  CircleDashed,
  ClipboardList,
  Clock,
  Gauge
} from "lucide-react";
import Navbar from "../components/dashboard/Navbar";
import GlassCard from "../components/ui/GlassCard";
import EmptyState from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { normalizeStatus } from "../utils/helpers";
import { filterRealTasks } from "../utils/taskFilters";
import { calculateHealthScore, formatHealthScore, getCompletionRate, getHealthTone } from "../utils/workflowHealth";

const CHART_COLORS = ["#48426D", "#F0C38E", "#F1AA9B", "#E5E7EB"];
const RISK_COLORS = { Blocked: "#F1AA9B", Overdue: "#F0C38E", Stuck: "#48426D" };

const chartTooltipStyle = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #E4E7EC",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    padding: "10px 14px",
    fontSize: 13,
    fontFamily: "Geist, DM Sans, sans-serif"
  },
  labelStyle: { color: "#111827", fontWeight: 500 },
  cursor: { stroke: "#E4E7EC", strokeWidth: 1 }
};

const axisTick = { fill: "#9CA3AF", fontSize: 12 };

const AnalyticsPage = () => {
  const { user, token } = useAuth();
  const { tasks, workflowHealth, isLoading, fetchTasks } = useTasks();

  useEffect(() => {
    if (token && user) fetchTasks();
  }, [token, user?.id, fetchTasks]);

  const realTasks = useMemo(() => filterRealTasks(tasks), [tasks]);

  const health = useMemo(
    () => workflowHealth || calculateHealthScore(tasks),
    [workflowHealth, tasks]
  );
  const completionRate = getCompletionRate(tasks);
  const tone = getHealthTone(health.healthScore);

  const statCards = [
    { label: "Total Tasks", value: realTasks.length, icon: ClipboardList },
    { label: "Completed Tasks", value: realTasks.filter((t) => t.status === "done").length, icon: CheckCheck },
    { label: "Blocked Tasks", value: health.blockedTasks, icon: Ban },
    { label: "Overdue Tasks", value: health.overdueTasks, icon: AlertTriangle },
    { label: "Stuck Tasks", value: health.stuckTasks, icon: Clock },
    { label: "Completion Rate", value: `${completionRate}%`, icon: Gauge }
  ];

  const statusChartData = useMemo(
    () => [
      { name: "Todo", value: realTasks.filter((t) => normalizeStatus(t.status, t) === "todo").length },
      { name: "In Progress", value: realTasks.filter((t) => normalizeStatus(t.status, t) === "in-progress").length },
      { name: "Blocked", value: realTasks.filter((t) => normalizeStatus(t.status, t) === "blocked").length },
      { name: "Done", value: realTasks.filter((t) => normalizeStatus(t.status, t) === "done").length }
    ],
    [realTasks]
  );

  const workflowHealthChartData = useMemo(
    () => [
      { name: "Blocked", tasks: health.blockedTasks, impact: health.blockedTasks * 5 },
      { name: "Overdue", tasks: health.overdueTasks, impact: health.overdueTasks * 3 },
      { name: "Stuck", tasks: health.stuckTasks, impact: health.stuckTasks * 2 }
    ],
    [health]
  );

  const riskChartData = useMemo(
    () => [
      { name: "Blocked", value: health.blockedTasks },
      { name: "Overdue", value: health.overdueTasks },
      { name: "Stuck", value: health.stuckTasks },
      { name: "On Track", value: Math.max(0, realTasks.length - health.blockedTasks - health.overdueTasks - health.stuckTasks) }
    ],
    [realTasks, health]
  );

  const completionTrend = useMemo(() => {
    const buckets = {};
    realTasks.forEach((t) => {
      const key = new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!buckets[key]) buckets[key] = { name: key, total: 0, done: 0 };
      buckets[key].total += 1;
      if (t.status === "done") buckets[key].done += 1;
    });
    return Object.values(buckets).slice(-6);
  }, [realTasks]);

  const priorityData = useMemo(
    () => [
      { name: "High", value: realTasks.filter((t) => t.priority === "high").length },
      { name: "Medium", value: realTasks.filter((t) => t.priority === "medium").length },
      { name: "Low", value: realTasks.filter((t) => t.priority === "low").length }
    ],
    [realTasks]
  );

  return (
    <div className="animate-fade-up min-h-screen">
      <div className="mx-auto max-w-7xl space-y-10 px-8 py-10">
      <Navbar user={user} search="" setSearch={() => {}} onNewTask={() => {}} title="Analytics" hideSearch />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : realTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60">
          <EmptyState
            icon={BarChart2}
            title="No analytics yet"
            description="Create your first real task to see analytics and workflow charts."
          />
        </div>
      ) : (
        <>
          <GlassCard className="mb-6" hover={false}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-500">Insights</p>
                <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight text-gray-900">Analytics</h2>
                <p className="mt-2 text-sm text-gray-500">Task distribution and completion trends</p>
              </div>
              <div className="text-right">
                <p className={`font-heading text-4xl font-bold ${tone.className}`}>{formatHealthScore(health.healthScore)}</p>
                <p className="text-sm text-gray-400">Health Score · {tone.label}</p>
              </div>
            </div>
          </GlassCard>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <GlassCard key={card.label} className="!p-6" hover={false}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                    <card.icon size={20} className="text-brand-600" />
                  </div>
                  <span className="rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                    Metric
                  </span>
                </div>
                <p className="mb-1 font-heading text-3xl font-bold tracking-tight text-gray-900">{card.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{card.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard hover={false} className="lg:col-span-2">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="font-heading text-base font-semibold text-gray-800">Workflow Health</h3>
                  <p className="mt-1 text-sm text-gray-500">Score penalties by risk category (max 100%)</p>
                </div>
                <div className="text-right">
                  <p className={`font-heading text-3xl font-bold ${tone.className}`}>{formatHealthScore(health.healthScore)}</p>
                  <p className="text-xs text-gray-400">{health.totalTasks ?? realTasks.length} real tasks</p>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workflowHealthChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
                    <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      {...chartTooltipStyle}
                      formatter={(value, key) => [value, key === "impact" ? "Score penalty" : "Tasks"]}
                    />
                    <Bar dataKey="tasks" name="Tasks" radius={[6, 6, 0, 0]}>
                      {workflowHealthChartData.map((entry) => (
                        <Cell key={entry.name} fill={RISK_COLORS[entry.name] || "#48426D"} />
                      ))}
                    </Bar>
                    <Bar dataKey="impact" name="Score penalty" radius={[6, 6, 0, 0]} fillOpacity={0.35}>
                      {workflowHealthChartData.map((entry) => (
                        <Cell key={`${entry.name}-impact`} fill={RISK_COLORS[entry.name] || "#48426D"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Formula: 100 − (blocked×5) − (overdue×3) − (stuck×2)</span>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <h3 className="mb-6 font-heading text-base font-semibold text-gray-800">Task Completion Trend</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={completionTrend.length ? completionTrend : [{ name: "—", done: 0 }]}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#48426D" stopOpacity={0.14} />
                        <stop offset="100%" stopColor="#48426D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
                    <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Area type="monotone" dataKey="done" stroke="#48426D" fill="url(#purpleGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <h3 className="mb-6 font-heading text-base font-semibold text-gray-800">Tasks by Priority</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" horizontal={false} />
                    <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={60} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      <Cell fill="#F1AA9B" />
                      <Cell fill="#F0C38E" />
                      <Cell fill="#48426D" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <h3 className="mb-6 font-heading text-base font-semibold text-gray-800">Tasks by Status</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2F4F7" vertical={false} />
                    <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusChartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <h3 className="mb-6 font-heading text-base font-semibold text-gray-800">Risk Distribution</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {riskChartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                {riskChartData.map((item, i) => (
                  <span key={item.name} className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i] }} />
                    {item.name}: {item.value}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
