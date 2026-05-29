import { validationResult } from "express-validator";
import Task from "../models/Task.js";
import { calculateHealthScore } from "../utils/workflowHealth.js";
import { normalizeStatus, serializeTask, TASK_STATUSES } from "../utils/status.js";

const ensureOwnerTask = async (taskId, userId) =>
  Task.findOne({ _id: taskId, userId });

const applyStatusSideEffects = (task, status) => {
  const next = normalizeStatus(status, task);
  task.status = next;
  if (next === "blocked") {
    if (!task.blockedAt) task.blockedAt = new Date();
  } else {
    task.blockedReason = "";
    task.blockedAt = null;
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const serialized = tasks.map(serializeTask);
    console.log(`GET /api/tasks user=${req.user.id} count=${serialized.length}`);
    return res.status(200).json({ tasks: serialized });
  } catch (error) {
    console.error("GET /api/tasks failed:", error.message);
    return next(error);
  }
};

export const getWorkflowHealth = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    const health = calculateHealthScore(tasks.map(serializeTask));
    console.log(`GET /api/tasks/workflow-health user=${req.user.id}`, health);
    return res.status(200).json(health);
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const payload = { ...req.body, userId: req.user.id, isOnboarding: false };
    payload.status = normalizeStatus(payload.status || "todo", payload);
    if (payload.status === "blocked" && payload.blockedReason) {
      payload.blockedAt = new Date();
    }

    const task = await Task.create(payload);
    return res.status(201).json({ task: serializeTask(task) });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await ensureOwnerTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const fields = ["title", "description", "priority", "dueDate", "status", "subtasks", "blockedReason"];
    // isOnboarding is system-managed; never accept changes from the client
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "dueDate" && !req.body[field]) {
          task[field] = undefined;
        } else {
          task[field] = req.body[field];
        }
      }
    });

    if (req.body.status !== undefined) {
      applyStatusSideEffects(task, req.body.status);
      if (normalizeStatus(req.body.status, task) === "blocked" && req.body.blockedReason) {
        task.blockedReason = req.body.blockedReason.trim();
      }
    } else if (req.body.blockedReason !== undefined && normalizeStatus(task.status, task) === "blocked") {
      task.blockedReason = req.body.blockedReason.trim();
    }

    await task.save();
    return res.json({ task: serializeTask(task) });
  } catch (error) {
    return next(error);
  }
};

export const blockTask = async (req, res, next) => {
  try {
    const task = await ensureOwnerTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "blocked";
    task.blockedReason = (req.body.blockedReason || "").trim();
    task.blockedAt = new Date();
    await task.save();

    console.log(`PATCH /api/tasks/${req.params.id}/block user=${req.user.id}`);
    return res.json({ task: serializeTask(task) });
  } catch (error) {
    return next(error);
  }
};

export const unblockTask = async (req, res, next) => {
  try {
    const task = await ensureOwnerTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "todo";
    task.blockedReason = "";
    task.blockedAt = null;
    await task.save();

    console.log(`PATCH /api/tasks/${req.params.id}/unblock user=${req.user.id}`);
    return res.json({ task: serializeTask(task) });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await ensureOwnerTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    return res.json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalized = normalizeStatus(status);
    if (!TASK_STATUSES.includes(normalized)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await ensureOwnerTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    applyStatusSideEffects(task, normalized);
    await task.save();
    return res.json({ task: serializeTask(task) });
  } catch (error) {
    return next(error);
  }
};
