import { Brain } from "lucide-react";

export default function ChatLoading() {
      return (
            <div className="flex min-h-screen items-center justify-center bg-[#020617]">
                  <div className="flex flex-col items-center gap-5">
                        <div className="relative">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                                    <Brain size={30} className="animate-pulse text-emerald-400" />
                              </div>
                              <div className="absolute -inset-1 animate-ping rounded-2xl border border-emerald-500/20 opacity-75" />
                        </div>
                        <div className="text-sm font-medium text-slate-400">Loading chat...</div>
                        <div className="flex items-center gap-1.5">
                              <div
                                    className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "0ms" }}
                              />
                              <div
                                    className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "150ms" }}
                              />
                              <div
                                    className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                    style={{ animationDelay: "300ms" }}
                              />
                        </div>
                  </div>
            </div>
      );
}
