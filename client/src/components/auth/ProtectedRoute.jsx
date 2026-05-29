import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex animate-fade-in flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[2.5px] border-surface-subtle border-t-brand-500" />
          <p className="text-[13px] font-medium text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
