import { Brain } from "lucide-react";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-r border-slate-200 items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-pulse">
          <Brain size={24} className="text-emerald-600" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 animate-pulse">
            <div className="h-7 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-56 bg-slate-100 rounded" />
          </div>
          <div className="rounded-2xl border border-slate-200 p-8 animate-pulse">
            <div className="space-y-5">
              <div><div className="h-4 w-24 bg-slate-100 rounded mb-1.5" /><div className="h-12 w-full bg-slate-100 rounded-xl" /></div>
              <div><div className="h-4 w-16 bg-slate-100 rounded mb-1.5" /><div className="h-12 w-full bg-slate-100 rounded-xl" /></div>
              <div className="h-12 w-full bg-slate-200 rounded-xl mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
