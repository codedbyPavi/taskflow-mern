import { NavLink } from "react-router-dom";
import { BarChart2, KanbanSquare, LogOut, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthorCredit from "../brand/AuthorCredit";
import TaskFlowLogo from "../brand/TaskFlowLogo";

const navLinkClass = ({ isActive }) =>
  `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${
    isActive
      ? "bg-sidebar-active text-accent-cream shadow-sm ring-1 ring-accent-cream/20"
      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-text"
  }`;

const SidebarContent = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const handleNav = () => onNavigate?.();
  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="flex h-[64px] items-center gap-3 border-b border-sidebar-border px-5">
        <TaskFlowLogo variant="navbar" />
        <span className="font-heading text-[16px] font-semibold tracking-tight text-sidebar-text">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">Workspace</p>
        <NavLink to="/dashboard" className={navLinkClass} onClick={handleNav}>
          {({ isActive }) => (
            <>
              <KanbanSquare className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-accent-cream" : "text-sidebar-muted"}`} />
              <span>Board</span>
            </>
          )}
        </NavLink>

        <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-muted">Insights</p>
        <NavLink to="/analytics" className={navLinkClass} onClick={handleNav}>
          {({ isActive }) => (
            <>
              <BarChart2 className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-accent-cream" : "text-sidebar-muted"}`} />
              <span>Analytics</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-5">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500/40 ring-1 ring-accent-cream/20">
            <span className="text-xs font-semibold text-accent-cream">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-text">{user?.name}</p>
            <p className="truncate text-xs text-sidebar-muted">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-all duration-200 ease-in-out hover:bg-sidebar-hover hover:text-sidebar-text"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <AuthorCredit className="mt-4 px-1" />
      </div>
    </>
  );
};

const Sidebar = ({ mobileOpen, onMobileClose }) => (
  <>
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-sidebar shadow-lg lg:flex">
      <SidebarContent />
    </aside>

    {mobileOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm" onClick={onMobileClose} />
        <aside className="relative flex h-full w-64 animate-slide-in flex-col bg-sidebar shadow-modal">
          <button
            type="button"
            onClick={onMobileClose}
            className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-xl text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-text"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent onNavigate={onMobileClose} />
        </aside>
      </div>
    )}
  </>
);

export default Sidebar;
