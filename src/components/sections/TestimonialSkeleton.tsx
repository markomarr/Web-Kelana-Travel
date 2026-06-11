export function TestimonialSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-4 rounded-full bg-white/10" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="h-4 w-1/3 rounded bg-white/10" />
        <div className="mt-2 h-3 w-1/4 rounded bg-white/10" />
      </div>
    </div>
  );
}
