import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Ban, Calendar, Clock, MoreHorizontal } from "lucide-react";
import Badge from "../ui/Badge";
import { formatDate, statusLabel } from "../../utils/helpers";
import { isOnboardingTask } from "../../utils/taskFilters";
import { isBlocked, isOverdue, isStuck } from "../../utils/workflowHealth";

const TaskCard = ({ task, onEdit, onDelete, onBlock, onUnblock, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const total = task.subtasks?.length || 0;
  const done = task.subtasks?.filter((item) => item.completed).length || 0;
  const overdue = isOverdue(task);
  const stuck = isStuck(task);
  const blocked = isBlocked(task);
  const onboarding = isOnboardingTask(task);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${index * 60}ms`
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border border-surface-border bg-white p-5 shadow-card transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-card-lift ${
        isDragging ? "dragging" : ""
      } ${blocked ? "border-accent-peach/40" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 cursor-grab" {...attributes} {...listeners} onClick={() => onEdit(task)}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {onboarding ? (
                <span className="rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600">
                  Guide
                </span>
              ) : (
                <Badge priority={task.priority || "medium"}>{task.priority}</Badge>
              )}
            </div>
            <span className="font-mono text-[10px] text-gray-300">#{String(task._id).slice(-4)}</span>
          </div>
          <p className="text-[15px] font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-brand-500">
            {task.title}
          </p>
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {statusLabel(task.status, task)}
          </p>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 opacity-0 transition-all duration-200 hover:bg-brand-50 hover:text-brand-500 group-hover:opacity-100"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-44 rounded-2xl border border-surface-border bg-white p-1.5 shadow-dropdown">
              <button
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-gray-700 transition-colors hover:bg-brand-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(task);
                }}
              >
                Edit
              </button>
              {blocked ? (
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-brand-500 transition-colors hover:bg-brand-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onUnblock(task);
                  }}
                >
                  Unblock
                </button>
              ) : (
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onBlock(task);
                  }}
                >
                  Mark blocked
                </button>
              )}
              <button
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-red-600 transition-colors hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(task._id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-gray-400" onClick={() => onEdit(task)}>
          {task.description}
        </p>
      )}

      {(blocked || overdue || stuck) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {blocked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent-peach/40 bg-[#FDF3F0] px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              <Ban className="h-3 w-3" /> Blocked
            </span>
          )}
          {overdue && !blocked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent-cream/50 bg-[#FDF8EE] px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              <AlertTriangle className="h-3 w-3" /> Overdue
            </span>
          )}
          {stuck && !blocked && (
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600">
              <Clock className="h-3 w-3" /> Stuck
            </span>
          )}
        </div>
      )}

      {blocked && task.blockedReason && (
        <p className="mt-2 line-clamp-2 text-[12px] text-gray-500">{task.blockedReason}</p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-surface-subtle pt-3.5">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-300" />
          <span className={`text-[12px] ${overdue ? "font-medium text-amber-600" : "text-gray-400"}`}>
            {formatDate(task.dueDate)}
          </span>
        </div>
        {total > 0 && (
          <span className="text-[11px] text-gray-400">
            {done}/{total} subtasks
          </span>
        )}
      </div>

      {total > 0 && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-subtle">
          <div className="h-full rounded-full bg-success-500 transition-all duration-300" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      )}
    </article>
  );
};

export default TaskCard;
