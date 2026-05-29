import { Router } from "express";
import { body } from "express-validator";
import {
  blockTask,
  createTask,
  deleteTask,
  getTasks,
  getWorkflowHealth,
  unblockTask,
  updateTask,
  updateTaskStatus
} from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/workflow-health", getWorkflowHealth);
router.get("/", getTasks);
router.post(
  "/",
  [body("title").trim().notEmpty().withMessage("Title is required")],
  createTask
);
router.patch("/:id/block", blockTask);
router.patch("/:id/unblock", unblockTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/status", updateTaskStatus);

export default router;
