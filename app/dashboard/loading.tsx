import { Brain } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-slate-50/90 via-white to-white">
      <div className="chat-mesh pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
            <Brain size={30} className="animate-pulse text-black" strokeWidth={2} />
          </div>
          <div className="absolute -inset-1 animate-ping rounded-2xl border border-slate-200 opacity-60" />
        </div>
        <div className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
          Loading dashboard…
        </div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full animate-[shimmer-bar_1.5s_ease-in-out_infinite] rounded-full bg-black"
            style={{ width: "40%" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
