import { Brain } from "lucide-react";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden items-center justify-center border-r border-slate-200 bg-slate-50 lg:flex lg:w-1/2">
        <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
          <Brain size={24} className="text-emerald-600" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 animate-pulse">
            <div className="mb-2 h-7 w-40 rounded bg-slate-200" />
            <div className="h-4 w-56 rounded bg-slate-100" />
          </div>
          <div className="animate-pulse rounded-2xl border border-slate-200 p-8">
            <div className="space-y-5">
              <div>
                <div className="mb-1.5 h-4 w-24 rounded bg-slate-100" />
                <div className="h-12 w-full rounded-xl bg-slate-100" />
              </div>
              <div>
                <div className="mb-1.5 h-4 w-16 rounded bg-slate-100" />
                <div className="h-12 w-full rounded-xl bg-slate-100" />
              </div>
              <div className="mt-2 h-12 w-full rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
