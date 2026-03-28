import { Brain } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Brain size={30} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl border border-emerald-500/20 animate-ping opacity-75" />
        </div>
        <div className="text-sm font-medium text-slate-400">Loading dashboard...</div>
        <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 animate-[shimmer-bar_1.5s_ease-in-out_infinite]" style={{ width: "40%" }} />
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
