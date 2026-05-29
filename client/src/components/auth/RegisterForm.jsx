import { AlertCircle, Lock, Mail, User } from "lucide-react";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

const fieldClass =
  "h-11 w-full rounded-xl border border-surface-border bg-white/90 py-0 pl-10 pr-4 text-[14px] text-gray-900 placeholder-gray-400 transition-all duration-200 hover:border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

const ErrorMsg = ({ message }) =>
  message ? (
    <div className="flex items-center gap-2 rounded-[10px] border border-rose-100 bg-rose-50 px-3.5 py-2.5">
      <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
      <p className="text-[13px] text-rose-600">{message}</p>
    </div>
  ) : null;

const RegisterForm = ({ form, errors, loading, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-500">Full name</label>
      <div className="relative">
        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input name="name" placeholder="Jane Cooper" value={form.name} onChange={onChange} className={fieldClass} required />
      </div>
      <ErrorMsg message={errors.name} />
    </div>
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-500">Email address</label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={onChange} className={fieldClass} required />
      </div>
      <ErrorMsg message={errors.email} />
    </div>
    <div className="space-y-1.5">
      <label className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-500">Password</label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} className={fieldClass} required />
      </div>
      <ErrorMsg message={errors.password} />
    </div>
    <Button type="submit" className="h-11 w-full" disabled={loading}>
      {loading && <Spinner size="sm" />}
      {loading ? "Creating..." : "Create account"}
    </Button>
  </form>
);

export default RegisterForm;
