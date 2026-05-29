export const TASK_STATUSES = ["todo", "in-progress", "blocked", "done"];

export const normalizeStatus = (status, task = {}) => {
  if (task?.blocked && status !== "blocked") return "blocked";
  if (status === "inprogress") return "in-progress";
  if (TASK_STATUSES.includes(status)) return status;
  return "todo";
};

export const STATUS_COLUMNS = [
  { id: "todo", title: "Todo", dot: "bg-gray-300" },
  { id: "in-progress", title: "In Progress", dot: "bg-amber-400" },
  { id: "blocked", title: "Blocked", dot: "bg-red-400" },
  { id: "done", title: "Done", dot: "bg-emerald-500" }
];

export const formatDate = (value) => {
  if (!value) return "No deadline";
  return new Date(value).toLocaleDateString();
};

export const statusLabel = (status) => {
  const map = {
    todo: "Todo",
    "in-progress": "In Progress",
    blocked: "Blocked",
    done: "Done"
  };
  return map[normalizeStatus(status)] || status;
};
