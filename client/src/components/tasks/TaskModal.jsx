import { useEffect, useState } from "react";
import { Ban, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SubtaskPanel from "./SubtaskPanel";
import { normalizeStatus } from "../../utils/helpers";
import { isBlocked } from "../../utils/workflowHealth";

const STATUS_OPTIONS = [
  { id: "todo", label: "Todo" },
  { id: "in-progress", label: "In Progress" },
  { id: "blocked", label: "Blocked" },
  { id: "done", label: "Done" }
];

const TaskModal = ({ open, mode, initial, onClose, onSave, onBlock, onUnblock }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
    blockedReason: "",
    subtasks: []
  });
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      const status = normalizeStatus(initial.status, initial);
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        priority: initial.priority || "medium",
        dueDate: initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : "",
        status,
        blockedReason: initial.blockedReason || "",
        subtasks: initial.subtasks || []
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
        blockedReason: "",
        subtasks: []
      });
    }
  }, [initial, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = { ...form };
    if (form.dueDate) {
      payload.dueDate = new Date(form.dueDate).toISOString();
    } else {
      payload.dueDate = null;
    }
    if (payload.status !== "blocked") {
      payload.blockedReason = "";
    }
    onSave(payload);
  };

  const handleMarkBlocked = async () => {
    if (!form.blockedReason.trim()) return;
    if (mode === "edit" && initial?._id && onBlock) {
      setBlockLoading(true);
      try {
        await onBlock(initial._id, form.blockedReason.trim());
        onClose();
      } catch {
        // toast handled
      } finally {
        setBlockLoading(false);
      }
    } else {
      setForm((prev) => ({ ...prev, status: "blocked" }));
    }
  };

  const handleUnblock = async () => {
    if (mode === "edit" && initial?._id && onUnblock) {
      setBlockLoading(true);
      try {
        await onUnblock(initial._id);
        onClose();
      } catch {
        // toast handled
      } finally {
        setBlockLoading(false);
      }
    }
  };

  const blocked = isBlocked({ status: form.status, blocked: form.status === "blocked" });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <aside className="animate-slideIn relative ml-auto flex h-full w-full max-w-[480px] flex-col border-l border-surface-border bg-white shadow-modal">
        <div className="flex items-center justify-between border-b border-surface-subtle px-8 pb-5 pt-7">
          <div>
            <h2 className="text-[18px] font-bold tracking-tight text-gray-900">
              {mode === "edit" ? "Edit task" : "New task"}
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-400">
              {mode === "edit" ? "Update task details" : "Add a task to your board"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
          <div className="flex flex-col gap-5">
            <Input label="Task Title" name="title" value={form.title} onChange={handleChange} placeholder="What needs to be done?" required />

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Add context for your team..."
                className="w-full resize-none rounded-[10px] border border-surface-border bg-surface-alt px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                      form.priority === p
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-surface-border bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Due Date" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setForm((prev) => ({ ...prev, status: s.id }))}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-all duration-150 ${
                      form.status === s.id
                        ? s.id === "blocked"
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-brand-500 bg-brand-500 text-white shadow-sm"
                        : "border-surface-border bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-4 ${blocked ? "border-red-100 bg-red-50/50" : "border-gray-100 bg-gray-50/80"}`}>
              <div className="mb-3 flex items-center gap-2">
                <Ban className={`h-4 w-4 ${blocked ? "text-red-500" : "text-gray-400"}`} />
                <p className="text-sm font-semibold text-gray-800">Block status</p>
              </div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Blocked reason</label>
              <textarea
                name="blockedReason"
                rows={2}
                value={form.blockedReason}
                onChange={handleChange}
                placeholder="What's blocking progress?"
                className="mb-3 w-full resize-none rounded-[10px] border border-surface-border bg-white px-4 py-3 text-[14px] text-gray-700 placeholder-gray-400 transition-all duration-200 hover:border-gray-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {blocked && initial?.blockedAt && (
                <p className="mb-3 font-mono text-xs text-gray-400">
                  Blocked {new Date(initial.blockedAt).toLocaleDateString()}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {!blocked ? (
                  <Button type="button" variant="danger" onClick={handleMarkBlocked} disabled={blockLoading || !form.blockedReason.trim()}>
                    {blockLoading ? "Blocking..." : "Mark as Blocked"}
                  </Button>
                ) : (
                  <Button type="button" variant="secondary" onClick={handleUnblock} disabled={blockLoading}>
                    Unblock Task
                  </Button>
                )}
              </div>
            </div>

            {blocked && form.blockedReason && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-red-100 bg-white px-2 py-0.5 text-xs font-medium text-red-600">
                  BLOCKED
                </span>
                <p className="mt-2 text-sm text-gray-700">{form.blockedReason}</p>
              </div>
            )}

            <SubtaskPanel title={form.title} subtasks={form.subtasks} onChange={(items) => setForm((prev) => ({ ...prev, subtasks: items }))} />
          </div>

          <div className="mt-auto flex justify-end gap-3 border-t border-surface-subtle bg-surface-alt px-8 py-5">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Task</Button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default TaskModal;
