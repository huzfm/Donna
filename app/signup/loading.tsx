import { Brain } from "lucide-react";

export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 animate-pulse">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Brain size={18} className="text-emerald-400" />
            </div>
            <div className="h-5 w-16 bg-slate-800 rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-4 w-12 bg-slate-800 rounded" />
            <div className="h-11 w-full bg-slate-800 rounded-lg" />
            <div className="h-4 w-16 bg-slate-800 rounded" />
            <div className="h-11 w-full bg-slate-800 rounded-lg" />
            <div className="h-4 w-28 bg-slate-800 rounded" />
            <div className="h-11 w-full bg-slate-800 rounded-lg" />
            <div className="h-11 w-full bg-emerald-500/20 rounded-lg mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
