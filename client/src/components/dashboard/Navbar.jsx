import { Search } from "lucide-react";
import Button from "../ui/Button";

const Navbar = ({ user, search, setSearch, onNewTask, title = "Board", hideSearch = false }) => (
  <div className="flex flex-col gap-6 pb-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-500">Workspace</p>
      <h1 className="font-heading mt-1 text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-1.5 text-sm text-gray-500">
        {user?.name ? `Welcome back, ${user.name}` : "Your tasks at a glance"}
      </p>
    </div>
    {!hideSearch && (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="h-10 w-full rounded-xl border border-surface-border bg-white py-0 pl-10 pr-4 text-[14px] text-gray-900 shadow-xs transition-all duration-200 placeholder:text-gray-400 hover:border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
        <Button onClick={onNewTask} className="w-full sm:w-auto">
          New task
        </Button>
      </div>
    )}
  </div>
);

export default Navbar;
