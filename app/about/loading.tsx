export default function AboutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <span className="font-(family-name:--font-doto) text-2xl font-black text-slate-900">D</span>
          </div>
        </div>
        <p className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
          Loading…
        </p>
      </div>
    </div>
  );
}
