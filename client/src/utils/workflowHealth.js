import { normalizeStatus } from "./helpers.js";
import { filterRealTasks } from "./taskFilters.js";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const norm = (task) => ({ ...task, status: normalizeStatus(task?.status, task) });

export const isOverdue = (task) => {
  const t = norm(task);
  if (!t.dueDate || t.status === "done") return false;
  const due = new Date(t.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < startOfToday();
};

export const isStuck = (task) => {
  const t = norm(task);
  if (t.status !== "in-progress") return false;
  const updated = new Date(t.updatedAt || t.createdAt);
  return Date.now() - updated.getTime() > THREE_DAYS_MS;
};

export const isBlocked = (task) => normalizeStatus(task?.status, task) === "blocked";

export const calculateHealthScore = (tasks = []) => {
  const realTasks = filterRealTasks(tasks);
  const totalTasks = realTasks.length;
  const blockedTasks = realTasks.filter(isBlocked).length;
  const overdueTasks = realTasks.filter(isOverdue).length;
  const stuckTasks = realTasks.filter(isStuck).length;

  if (totalTasks === 0) {
    return {
      totalTasks: 0,
      blockedTasks: 0,
      overdueTasks: 0,
      stuckTasks: 0,
      healthScore: null
    };
  }

  const healthScore = Math.max(0, 100 - blockedTasks * 5 - overdueTasks * 3 - stuckTasks * 2);

  return {
    totalTasks,
    blockedTasks,
    overdueTasks,
    stuckTasks,
    healthScore
  };
};

export const formatHealthScore = (score) => (score == null ? "N/A" : `${score}%`);

export const getHealthTone = (score) => {
  if (score == null) {
    return { label: "N/A", className: "text-gray-500", bar: "bg-gray-300", ring: "#E5E7EB" };
  }
  if (score >= 80) return { label: "Excellent", className: "text-green-600", bar: "bg-success-500", ring: "#48426D" };
  if (score >= 60) return { label: "Moderate", className: "text-amber-600", bar: "bg-amber-400", ring: "#F0C38E" };
  return { label: "Needs attention", className: "text-red-600", bar: "bg-red-500", ring: "#F1AA9B" };
};

export const getCompletionRate = (tasks = []) => {
  const realTasks = filterRealTasks(tasks);
  if (!realTasks.length) return 0;
  const done = realTasks.filter((t) => normalizeStatus(t.status, t) === "done").length;
  return Math.round((done / realTasks.length) * 100);
};
