import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import { STATUS_COLUMNS } from "../../utils/helpers";

const VALID_STATUSES = STATUS_COLUMNS.map((c) => c.id);

const KanbanBoard = ({ groupedTasks, onEditTask, onDeleteTask, onBlockTask, onUnblockTask, onAddTask, onMoveTask }) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const status = over.data.current?.columnId || over.id;
    if (status && VALID_STATUSES.includes(status)) {
      onMoveTask(active.id, status);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STATUS_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={groupedTasks[col.id] || []}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onBlockTask={onBlockTask}
            onUnblockTask={onUnblockTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
