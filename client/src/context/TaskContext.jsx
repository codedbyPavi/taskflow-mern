import { createContext, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getApiReachabilityMessage } from "../api/healthCheck";
import { normalizeStatus } from "../utils/helpers";
import { isOnboardingTask } from "../utils/taskFilters";

export const TaskContext = createContext(null);

const FETCH_TASKS_TOAST_ID = "fetch-tasks-error";

const normalizeTask = (task) => {
  const status = normalizeStatus(task.status, task);
  return {
    ...task,
    status,
    blocked: status === "blocked",
    blockedReason: status === "blocked" ? task.blockedReason || "" : "",
    blockedAt: status === "blocked" ? task.blockedAt || null : null,
    isOnboarding: isOnboardingTask(task)
  };
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [workflowHealth, setWorkflowHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkflowHealth = useCallback(async () => {
    try {
      const { data } = await api.get("/api/tasks/workflow-health");
      setWorkflowHealth(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/tasks");
      const list = (Array.isArray(data?.tasks) ? data.tasks : []).map(normalizeTask);
      setTasks(list);
      await fetchWorkflowHealth();
      setError(null);
      toast.dismiss(FETCH_TASKS_TOAST_ID);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request && !err.response ? await getApiReachabilityMessage(err) : "Failed to fetch tasks");
      setError(message);
      toast.error(message, { id: FETCH_TASKS_TOAST_ID });
    } finally {
      setIsLoading(false);
    }
  }, [fetchWorkflowHealth]);

  const syncAfterMutation = async (nextTasks) => {
    setTasks(nextTasks);
    await fetchWorkflowHealth();
  };

  const createTask = async (payload) => {
    try {
      const { data } = await api.post("/api/tasks", payload);
      const next = [normalizeTask(data.task), ...tasks];
      await syncAfterMutation(next);
      toast.success("Task created");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err;
    }
  };

  const updateTask = async (id, payload) => {
    try {
      const { data } = await api.put(`/api/tasks/${id}`, payload);
      const next = tasks.map((task) => (task._id === id ? normalizeTask(data.task) : task));
      await syncAfterMutation(next);
      toast.success("Task updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      throw err;
    }
  };

  const blockTask = async (id, blockedReason) => {
    try {
      const { data } = await api.patch(`/api/tasks/${id}/block`, { blockedReason });
      const next = tasks.map((task) => (task._id === id ? normalizeTask(data.task) : task));
      await syncAfterMutation(next);
      toast.success("Task marked as blocked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to block task");
      throw err;
    }
  };

  const unblockTask = async (id) => {
    try {
      const { data } = await api.patch(`/api/tasks/${id}/unblock`);
      const next = tasks.map((task) => (task._id === id ? normalizeTask(data.task) : task));
      await syncAfterMutation(next);
      toast.success("Task unblocked");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unblock task");
      throw err;
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/api/tasks/${id}/status`, { status });
      const next = tasks.map((task) => (task._id === id ? normalizeTask(data.task) : task));
      await syncAfterMutation(next);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to move task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      const next = tasks.filter((task) => task._id !== id);
      await syncAfterMutation(next);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
      throw err;
    }
  };

  const groupedTasks = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      "in-progress": tasks.filter((task) => task.status === "in-progress"),
      blocked: tasks.filter((task) => task.status === "blocked"),
      done: tasks.filter((task) => task.status === "done")
    }),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        groupedTasks,
        workflowHealth,
        isLoading,
        error,
        fetchTasks,
        fetchWorkflowHealth,
        createTask,
        updateTask,
        blockTask,
        unblockTask,
        updateTaskStatus,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
