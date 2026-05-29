const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="skeleton mb-3 h-3 w-3/4 rounded-full" />
    <div className="skeleton h-3 w-1/2 rounded-full" />
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
    <div className="space-y-3">
      <div className="skeleton h-3 w-1/4 rounded-full" />
      <div className="skeleton h-6 w-1/2 rounded-full" />
      <div className="space-y-2 pt-2">
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-5/6 rounded-full" />
        <div className="skeleton h-3 w-3/4 rounded-full" />
      </div>
    </div>
  </div>
);

export default Skeleton;
