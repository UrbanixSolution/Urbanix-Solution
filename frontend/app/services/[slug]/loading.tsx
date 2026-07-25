export default function ServiceLoading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-16 section-wrap animate-pulse">
      {/* Back button skeleton */}
      <div className="h-6 w-28 bg-slate-800/60 rounded mb-8" />

      {/* Header skeleton */}
      <div className="max-w-3xl space-y-4 mb-12">
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
        <div className="h-10 sm:h-14 w-3/4 bg-slate-800/80 rounded-xl" />
        <div className="h-6 w-2/3 bg-slate-800/50 rounded" />
      </div>

      {/* Features grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[1, 2, 4].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-[#111827] border border-slate-800 p-6 space-y-3">
            <div className="h-6 w-1/2 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800/60 rounded" />
            <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
