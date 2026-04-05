"use client";

import { useCallback } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";

interface UploadItem {
      id: string;
      name: string;
      status: "uploading" | "done" | "error";
      error?: string;
}

interface FileDropZoneProps {
      uploadQueue: UploadItem[];
      dragOver: boolean;
      colSpan?: boolean;
      onUpload: (f: File) => void;
      onDragOver: (e: React.DragEvent) => void;
      onDragLeave: () => void;
      onDrop: (e: React.DragEvent) => void;
}

export default function FileDropZone({
      uploadQueue,
      dragOver,
      colSpan,
      onUpload,
      onDragOver,
      onDragLeave,
      onDrop,
}: FileDropZoneProps) {
      // Always derived from the queue — correct even when multiple files upload concurrently
      const uploading = uploadQueue.some((i) => i.status === "uploading");
      const handleFileInput = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                  Array.from(e.target.files || []).forEach(onUpload);
            },
            [onUpload]
      );

      return (
            <label
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`${colSpan ? "md:col-span-3" : ""} flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 sm:p-8 ${
                        dragOver
                              ? "border-slate-300 bg-slate-100/90 shadow-lg shadow-slate-300/10"
                              : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-100/20 hover:shadow-md"
                  }`}
            >
                  <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
                        className="hidden"
                        multiple
                        onChange={handleFileInput}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 ring-1 ring-slate-300/60">
                        {uploading ? (
                              <Loader2 size={24} className="animate-spin text-black" />
                        ) : (
                              <Upload size={24} className="text-black" />
                        )}
                  </div>

                  {uploading && uploadQueue.length > 0 ? (
                        <div className="w-full space-y-2">
                              {uploadQueue.map((item) => (
                                    <div
                                          key={item.id}
                                          className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left ${item.status === "done" ? "border-emerald-200 bg-emerald-50/60" : item.status === "error" ? "border-red-200 bg-red-50/60" : "border-slate-200 bg-slate-50/60"}`}
                                    >
                                          <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${item.status === "done" ? "bg-emerald-100" : item.status === "error" ? "bg-red-100" : "bg-slate-100"}`}
                                          >
                                                {item.status === "uploading" ? (
                                                      <Loader2
                                                            size={12}
                                                            className="animate-spin text-slate-700"
                                                      />
                                                ) : item.status === "done" ? (
                                                      <CheckCircle2
                                                            size={12}
                                                            className="text-emerald-600"
                                                      />
                                                ) : (
                                                      <span className="text-[10px] text-red-500">
                                                            ✕
                                                      </span>
                                                )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] font-semibold text-slate-800">
                                                      {item.name}
                                                </p>
                                                <p
                                                      className={`text-[10px] font-medium ${item.status === "done" ? "text-emerald-600" : item.status === "error" ? "text-red-500" : "text-slate-500"}`}
                                                >
                                                      {item.status === "uploading"
                                                            ? "Uploading & indexing…"
                                                            : item.status === "done"
                                                              ? "Indexed ✓"
                                                              : (item.error ?? "Failed")}
                                                </p>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  ) : dragOver ? (
                        <p className="text-sm font-semibold text-black">Release to upload</p>
                  ) : (
                        <>
                              <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                          Drop files here or click to browse
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                          PDF · Word · Excel · CSV · TXT
                                    </p>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {["PDF", "DOCX", "XLSX", "CSV", "TXT"].map((t) => (
                                          <span
                                                key={t}
                                                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9px] font-medium text-slate-500"
                                          >
                                                .{t.toLowerCase()}
                                          </span>
                                    ))}
                              </div>
                        </>
                  )}
            </label>
      );
}
