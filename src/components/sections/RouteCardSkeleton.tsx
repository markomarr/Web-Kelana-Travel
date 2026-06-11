export function RouteCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex animate-pulse items-center gap-3">
        <div className="h-3 w-3 shrink-0 rounded-full bg-slate-200" />
        <div className="h-4 flex-1 rounded bg-slate-200" />
        <div className="h-px flex-1 bg-slate-200" />
        <div className="h-4 flex-1 rounded bg-slate-200" />
        <div className="h-3 w-3 shrink-0 rounded-full bg-slate-200" />
      </div>
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 flex-1 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
      </div>
      <div className="mt-6 h-10 w-full animate-pulse rounded-full bg-slate-200" />
    </div>
  );
}

interface RouteCardSkeletonGridProps {
  count?: number;
  /** Tailwind grid-cols class untuk breakpoint lg, default "lg:grid-cols-4" */
  lgCols?: "lg:grid-cols-3" | "lg:grid-cols-4";
}

export function RouteCardSkeletonGrid({ count = 4, lgCols = "lg:grid-cols-4" }: RouteCardSkeletonGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${lgCols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <RouteCardSkeleton key={i} />
      ))}
    </div>
  );
}
