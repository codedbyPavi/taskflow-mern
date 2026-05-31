import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import TaskFlowLogo from "../components/brand/TaskFlowLogo";

const LandingPage = () => (
  <div className="relative min-h-screen overflow-hidden bg-surface bg-auth-gradient">
    <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3">
        <TaskFlowLogo variant="sm" />
        <span className="font-heading text-[16px] font-semibold tracking-tight text-brand-500">TaskFlow</span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="rounded-xl px-4 py-2 text-[13px] font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-white/70 hover:text-brand-500"
        >
          Sign in
        </Link>
        <Link to="/register">
          <Button>Get started</Button>
        </Link>
      </div>
    </header>

    <main className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-8 pb-24 pt-24 text-center sm:pt-32">
      <h1 className="font-heading text-[40px] font-bold tracking-tight text-brand-500 sm:text-[48px]">TaskFlow</h1>
      <p className="mt-6 text-[17px] leading-relaxed text-gray-500">
        Organize work.
        <br />
        Track progress.
        <br />
        Monitor workflow health.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link to="/register">
          <Button className="h-11 px-7">Get started</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="h-11 px-7">
            Sign in
          </Button>
        </Link>
      </div>
    </main>

    <footer className="relative z-10 border-t border-surface-border py-6 text-center text-[12px] text-gray-400">
      TaskFlow &copy; {new Date().getFullYear()}
    </footer>
  </div>
);

export default LandingPage;
