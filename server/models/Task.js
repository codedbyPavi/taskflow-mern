import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true },
    completed: { type: Boolean, default: false }
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["todo", "inprogress", "in-progress", "blocked", "done"],
      default: "todo"
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subtasks: [subtaskSchema],
    blockedReason: { type: String, default: "" },
    blockedAt: { type: Date },
    isOnboarding: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
