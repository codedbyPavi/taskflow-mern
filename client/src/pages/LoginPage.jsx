import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import TaskFlowLogo from "../components/brand/TaskFlowLogo";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch {
      // toast handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface bg-auth-gradient p-6">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent-cream/25 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-[400px] w-[400px] rounded-full bg-brand-500/10 blur-[90px]" />

      <div className="relative z-10 w-full max-w-[420px] animate-scale-in">
        <div className="glass-card overflow-hidden rounded-4xl shadow-auth">
          <div className="border-b border-white/50 px-8 pb-8 pt-12 text-center">
            <div className="mb-8 inline-flex shadow-md">
              <TaskFlowLogo variant="auth" />
            </div>
            <h1 className="font-heading text-[26px] font-bold tracking-tight text-brand-500">TaskFlow</h1>
            <p className="mx-auto mt-4 max-w-[260px] text-[15px] leading-relaxed text-gray-500">
              Organize work.
              <br />
              Track progress.
              <br />
              Monitor workflow health.
            </p>
          </div>

          <div className="space-y-6 px-8 py-8">
            <LoginForm form={form} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />
            <p className="text-center text-[13px] text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-brand-500 transition-colors duration-200 hover:text-brand-600">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
