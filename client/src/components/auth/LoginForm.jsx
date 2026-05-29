import { AlertCircle, Lock, Mail } from "lucide-react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const fieldClass =
  "h-11 w-full rounded-xl border border-surface-border bg-white/90 py-0 pl-10 pr-4 text-[14px] text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

const LoginForm = ({ form, loading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-500">Email address</label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={onChange} className={fieldClass} required />
      </div>
    </div>
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-500">Password</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} className={fieldClass} required />
      </div>
    </div>
    <Button type="submit" className="h-11 w-full" disabled={loading}>
      {loading && <Spinner size="sm" />}
      {loading ? "Signing in..." : "Sign in"}
    </Button>
  </form>
);

export default LoginForm;
