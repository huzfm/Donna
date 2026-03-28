import { Brain } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Brain size={30} className="animate-pulse text-emerald-400" />
          </div>
          <div className="absolute -inset-1 animate-ping rounded-2xl border border-emerald-500/20 opacity-75" />
        </div>
        <div className="text-sm font-medium text-slate-400">Loading dashboard...</div>
        <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full animate-[shimmer-bar_1.5s_ease-in-out_infinite] rounded-full bg-emerald-500"
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
