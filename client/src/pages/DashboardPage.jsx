import { useEffect, useMemo, useState } from "react";

import { ClipboardList } from "lucide-react";

import AnalyticsCards from "../components/dashboard/AnalyticsCards";

import Navbar from "../components/dashboard/Navbar";

import WorkflowHealth from "../components/dashboard/WorkflowHealth";

import KanbanBoard from "../components/board/KanbanBoard";

import TaskModal from "../components/tasks/TaskModal";

import BlockTaskModal from "../components/tasks/BlockTaskModal";

import EmptyState from "../components/ui/EmptyState";

import { CardSkeleton } from "../components/ui/Skeleton";

import { useAuth } from "../hooks/useAuth";

import { useTasks } from "../hooks/useTasks";
import { filterRealTasks } from "../utils/taskFilters";



const DashboardPage = () => {

  const { user, token } = useAuth();

  const {

    tasks,

    groupedTasks,

    workflowHealth,

    isLoading,

    fetchTasks,

    createTask,

    updateTask,

    blockTask,

    unblockTask,

    updateTaskStatus,

    deleteTask

  } = useTasks();

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("create");

  const [activeTask, setActiveTask] = useState(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);

  const [blockTarget, setBlockTarget] = useState(null);

  const [blockReason, setBlockReason] = useState("");

  const [blockLoading, setBlockLoading] = useState(false);



  useEffect(() => {

    if (token && user) {

      fetchTasks();

    }

  }, [token, user?.id, fetchTasks]);



  const realTasks = useMemo(() => filterRealTasks(tasks), [tasks]);

  const filteredTasks = useMemo(() => {

    if (!search.trim()) return tasks;

    return tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

  }, [tasks, search]);



  const filteredGrouped = useMemo(() => {

    if (!search.trim()) return groupedTasks;

    const matches = (task) => task.title.toLowerCase().includes(search.toLowerCase());

    return {

      todo: groupedTasks.todo.filter(matches),

      "in-progress": groupedTasks["in-progress"].filter(matches),

      blocked: groupedTasks.blocked.filter(matches),

      done: groupedTasks.done.filter(matches)

    };

  }, [groupedTasks, search]);



  const openCreate = () => {

    setModalMode("create");

    setActiveTask(null);

    setModalOpen(true);

  };



  const openEdit = (task) => {

    setModalMode("edit");

    setActiveTask(task);

    setModalOpen(true);

  };



  const openBlock = (task) => {

    setBlockTarget(task);

    setBlockReason("");

    setBlockModalOpen(true);

  };



  const handleBlockConfirm = async () => {

    if (!blockTarget || !blockReason.trim()) return;

    setBlockLoading(true);

    try {

      await blockTask(blockTarget._id, blockReason.trim());

      setBlockModalOpen(false);

      setBlockTarget(null);

    } catch {

      // toast handled

    } finally {

      setBlockLoading(false);

    }

  };



  const handleUnblock = async (task) => {

    try {

      await unblockTask(task._id);

    } catch {

      // toast handled

    }

  };



  const handleSave = async (payload) => {

    try {

      if (modalMode === "edit" && activeTask) {

        await updateTask(activeTask._id, payload);

      } else {

        await createTask(payload);

      }

      setModalOpen(false);

    } catch {

      // toast handled

    }

  };



  const handleMove = async (id, status) => {

    const task = tasks.find((item) => String(item._id) === String(id));

    if (!task || task.status === status) return;

    try {

      await updateTaskStatus(id, status);

    } catch {

      // handled

    }

  };



  const handleDelete = async (id) => {

    try {

      await deleteTask(id);

    } catch {

      // handled

    }

  };



  return (

    <div className="animate-fade-up">

      <div className="mx-auto max-w-7xl space-y-10 px-8 py-10">

        <Navbar user={user} search={search} setSearch={setSearch} onNewTask={openCreate} />



        {isLoading ? (

          <div className="space-y-8">

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

              {[1, 2, 3, 4].map((i) => (

                <CardSkeleton key={i} />

              ))}

            </div>

            <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">

              {[1, 2, 3, 4].map((i) => (

                <CardSkeleton key={i} />

              ))}

            </div>

          </div>

        ) : (

          <>

            <WorkflowHealth health={workflowHealth} taskCount={realTasks.length} loading={false} />

            <AnalyticsCards tasks={tasks} />

            {tasks.length === 0 ? (

              <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">

                <EmptyState

                  icon={ClipboardList}

                  title="No tasks yet"

                  description="Create your first task to start tracking progress."

                  actionLabel="New task"

                  onAction={openCreate}

                />

              </div>

            ) : filteredTasks.length === 0 ? (

              <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">

                <EmptyState

                  icon={ClipboardList}

                  title="No results found"

                  description="Try different keywords or clear your search."

                  actionLabel="Clear search"

                  onAction={() => setSearch("")}

                />

              </div>

            ) : (

              <KanbanBoard

                groupedTasks={filteredGrouped}

                onEditTask={openEdit}

                onDeleteTask={handleDelete}

                onBlockTask={openBlock}

                onUnblockTask={handleUnblock}

                onAddTask={openCreate}

                onMoveTask={handleMove}

              />

            )}

          </>

        )}

      </div>



      <TaskModal

        open={modalOpen}

        mode={modalMode}

        initial={activeTask}

        onClose={() => setModalOpen(false)}

        onSave={handleSave}

        onBlock={blockTask}

        onUnblock={unblockTask}

      />

      <BlockTaskModal

        open={blockModalOpen}

        task={blockTarget}

        reason={blockReason}

        onReasonChange={setBlockReason}

        onConfirm={handleBlockConfirm}

        onClose={() => setBlockModalOpen(false)}

        loading={blockLoading}

      />

    </div>

  );

};



export default DashboardPage;

