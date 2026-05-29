import { isOnboardingTask } from "./taskFilters.js";

export const TASK_STATUSES = ["todo", "in-progress", "blocked", "done"];

export const normalizeStatus = (status, task = {}) => {
  if (task.blocked && status !== "blocked") return "blocked";
  if (status === "inprogress") return "in-progress";
  if (TASK_STATUSES.includes(status)) return status;
  return "todo";
};

export const serializeTask = (task) => {
  const obj = task.toObject ? task.toObject() : { ...task };
  const status = normalizeStatus(obj.status, obj);
  return {
    ...obj,
    status,
    blocked: status === "blocked",
    blockedReason: status === "blocked" ? obj.blockedReason || "" : "",
    blockedAt: status === "blocked" ? obj.blockedAt || null : null,
    isOnboarding: isOnboardingTask(obj)
  };
};
