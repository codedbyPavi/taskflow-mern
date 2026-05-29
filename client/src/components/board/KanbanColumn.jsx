import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Layout, Plus } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import TaskCard from "./TaskCard";
import { getColumnStyle } from "./kanbanStyles";

const ColumnDropArea = ({ columnId }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: columnId, data: { columnId } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-2 w-full opacity-0" aria-hidden="true" />;
};

const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask, onBlockTask, onUnblockTask, onAddTask }) => {
  const { setNodeRef } = useDroppable({ id: column.id, data: { columnId: column.id } });
  const sortableIds = [...tasks.map((task) => task._id), column.id];
  const styles = getColumnStyle(column.id);

  return (
    <div className={`w-[300px] flex-shrink-0 overflow-hidden rounded-3xl border border-surface-border/80 border-t-[3px] ${styles.track} ${styles.topBorder}`}>
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 flex-shrink-0 rounded-full ${styles.dot}`} />
          <h3 className="text-[13px] font-semibold tracking-tight text-gray-800">{column.title}</h3>
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.label}`}>{tasks.length}</span>
        </div>
        {column.id === "todo" && (
          <button
            type="button"
            onClick={onAddTask}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 ease-in-out hover:bg-white/80 hover:text-gray-700"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div ref={setNodeRef} className="min-h-[80px] space-y-2.5 px-3 pb-3">
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task, index) => (
            <TaskCard
              key={task._id}
              task={task}
              index={index}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onBlock={onBlockTask}
              onUnblock={onUnblockTask}
            />
          ))}
          {!tasks.length && <ColumnDropArea columnId={column.id} />}
        </SortableContext>

        {!tasks.length && (
          <div className="py-4">
            <EmptyState
              icon={Layout}
              title="No tasks"
              description="Drag tasks here or add one."
              actionLabel={column.id === "todo" ? "Add task" : undefined}
              onAction={column.id === "todo" ? onAddTask : undefined}
            />
          </div>
        )}
      </div>

      {column.id === "todo" && (
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={onAddTask}
            className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-200/80 bg-white/50 px-3 py-2.5 text-[13px] text-gray-400 transition-all duration-200 ease-in-out hover:border-gray-300 hover:bg-white hover:text-gray-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Add task
          </button>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
