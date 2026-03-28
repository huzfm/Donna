import { Brain } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
            <Brain size={28} className="text-emerald-600" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-2xl border-2 border-emerald-300 opacity-30" />
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
