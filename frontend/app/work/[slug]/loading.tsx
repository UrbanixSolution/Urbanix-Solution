export default function WorkLoading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-16 section-wrap animate-pulse">
      {/* Back button skeleton */}
      <div className="h-6 w-28 bg-slate-800/60 rounded mb-8" />

      {/* Header skeleton */}
      <div className="max-w-3xl space-y-4 mb-12">
        <div className="h-4 w-32 bg-[#00c4cc]/20 rounded-full" />
        <div className="h-10 sm:h-14 w-full bg-slate-800/80 rounded-xl" />
        <div className="h-6 w-2/3 bg-slate-800/50 rounded" />
      </div>

      {/* Image frame skeleton */}
      <div className="w-full h-80 sm:h-[450px] bg-slate-800/70 rounded-2xl border border-slate-800 mb-12" />

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-48 bg-slate-800 rounded" />
          <div className="h-4 w-full bg-slate-800/60 rounded" />
          <div className="h-4 w-11/12 bg-slate-800/60 rounded" />
          <div className="h-4 w-4/5 bg-slate-800/60 rounded" />
        </div>
        <div className="h-64 bg-[#111827] rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="h-6 w-36 bg-slate-800 rounded" />
          <div className="h-4 w-full bg-slate-800/60 rounded" />
          <div className="h-4 w-2/3 bg-slate-800/60 rounded" />
          <div className="h-10 w-full bg-[#10b981]/30 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  )
}
