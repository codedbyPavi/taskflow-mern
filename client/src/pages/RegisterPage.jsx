import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import TaskFlowLogo from "../components/brand/TaskFlowLogo";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name is too short";
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "Minimum 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const passwordStrength = Math.min(100, (form.password.length / 8) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch {
      // handled via toast
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
            {form.password.length > 0 && (
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-gray-400">
                  <span>Password strength</span>
                  <span>{passwordStrength >= 75 ? "Strong" : passwordStrength >= 40 ? "Fair" : "Weak"}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-subtle">
                  <div className="h-full rounded-full bg-brand-500 transition-all duration-200" style={{ width: `${passwordStrength}%` }} />
                </div>
              </div>
            )}
            <RegisterForm form={form} errors={errors} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />
            <p className="text-center text-[13px] text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand-500 transition-colors duration-200 hover:text-brand-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
