export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0f19] pt-24 pb-16 section-wrap animate-pulse">
      {/* Hero Skeleton Header */}
      <div className="max-w-3xl mx-auto space-y-6 text-center my-12">
        <div className="h-4 w-36 bg-[rgba(61,90,153,0.2)] rounded-full mx-auto" />
        <div className="h-12 sm:h-16 w-3/4 bg-slate-800/80 rounded-2xl mx-auto" />
        <div className="h-6 w-1/2 bg-slate-800/50 rounded-xl mx-auto" />
        <div className="flex justify-center gap-4 pt-4">
          <div className="h-12 w-44 bg-[#3d5a99]/40 rounded-xl" />
          <div className="h-12 w-44 bg-slate-800/60 rounded-xl" />
        </div>
      </div>

      {/* Grid Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl bg-[#111827] border border-slate-800/60 p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800" />
            <div className="h-6 w-3/4 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800/60 rounded" />
            <div className="h-4 w-5/6 bg-slate-800/60 rounded" />
            <div className="h-8 w-24 bg-slate-800/40 rounded-lg mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
