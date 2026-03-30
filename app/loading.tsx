export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <span className="font-(family-name:--font-doto) text-2xl font-black text-slate-900">
              D
            </span>
          </div>
          <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-slate-300 opacity-30" />
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
