import { normalizeStatus } from "./status.js";
import { filterRealTasks } from "./taskFilters.js";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const normalized = (task) => ({
  ...task,
  status: normalizeStatus(task.status, task)
});

export const isOverdue = (task) => {
  const t = normalized(task);
  if (!t.dueDate || t.status === "done") return false;
  const due = new Date(t.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < startOfToday();
};

export const isStuck = (task) => {
  const t = normalized(task);
  if (t.status !== "in-progress") return false;
  const updated = new Date(t.updatedAt || t.createdAt);
  return Date.now() - updated.getTime() > THREE_DAYS_MS;
};

export const isBlocked = (task) => normalizeStatus(task.status, task) === "blocked";

export const calculateHealthScore = (tasks) => {
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
