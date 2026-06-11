export function VehicleCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="aspect-video w-full animate-pulse bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-1 flex flex-wrap gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function VehicleCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
