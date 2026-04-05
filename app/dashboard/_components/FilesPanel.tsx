"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Loader2, Plus, Search, HardDrive, CheckCircle2, FolderOpen } from "lucide-react";
import { UploadedFile } from "./types";
import FileCard, { getFileCategory } from "./files/FileCard";
import FilePieChart from "./files/FilePieChart";
import FileDropZone from "./files/FileDropZone";

interface UploadItem {
      id: string;
      name: string;
      status: "uploading" | "done" | "error";
      error?: string;
}

function FilesPanel({
      files,
      filesLoading,
      uploadQueue,
      onUpload,
      onDelete,
}: {
      files: UploadedFile[];
      filesLoading: boolean;
      uploadQueue: UploadItem[];
      onUpload: (f: File) => void;
      onDelete: (name: string) => void;
}) {
      const uploading = uploadQueue.some((i) => i.status === "uploading");
      const [deleting, setDeleting] = useState<string | null>(null);
      const [dragOver, setDragOver] = useState(false);
      const [search, setSearch] = useState("");

      const pieData = useMemo(() => {
            const counts: Record<string, number> = {};
            for (const f of files) {
                  const cat = getFileCategory(f.file_name);
                  counts[cat.label] = (counts[cat.label] ?? 0) + 1;
            }
            return Object.entries(counts).map(([name, value]) => ({ name, value }));
      }, [files]);

      const filteredFiles = useMemo(() => {
            if (!search.trim()) return files;
            const q = search.toLowerCase();
            return files.filter((f) => f.file_name.toLowerCase().includes(q));
      }, [files, search]);

      const confirmDelete = useCallback(
            async (fileName: string) => {
                  if (!window.confirm(`Delete "${fileName}"?`)) return;
                  setDeleting(fileName);
                  await onDelete(fileName);
                  setDeleting(null);
            },
            [onDelete]
      );

      const hasPie = files.length > 0 && pieData.length > 0;

      return (
            <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col overflow-hidden bg-transparent"
            >
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 py-4 pr-4 pl-14 backdrop-blur-md sm:pr-6 md:pl-6">
                        <div className="flex items-center gap-2.5">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-black ring-1 ring-slate-300/60">
                                    <Database size={15} strokeWidth={2} />
                              </span>
                              <div>
                                    <h1 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
                                          Knowledge base
                                    </h1>
                                    <p className="text-[11px] text-slate-500">
                                          {files.length} document{files.length !== 1 ? "s" : ""}{" "}
                                          indexed
                                    </p>
                              </div>
                        </div>
                        <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-300/25 transition-all hover:ring-2 hover:ring-slate-300/20 sm:px-3.5">
                              {uploading ? (
                                    <Loader2 size={13} className="animate-spin" />
                              ) : (
                                    <Plus size={13} strokeWidth={2.5} />
                              )}
                              <span className="xs:inline hidden">
                                    {uploading ? "Uploading…" : "Add files"}
                              </span>
                              <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
                                    multiple
                                    onChange={(e) =>
                                          Array.from(e.target.files || []).forEach(onUpload)
                                    }
                              />
                        </label>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
                              {files.length > 0 && (
                                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                          {[
                                                {
                                                      label: "Total files",
                                                      value: files.length,
                                                      icon: Database,
                                                },
                                                {
                                                      label: "File types",
                                                      value: pieData.length,
                                                      icon: HardDrive,
                                                },
                                                {
                                                      label: "Indexed",
                                                      value: files.length,
                                                      icon: CheckCircle2,
                                                },
                                                { label: "Status", value: "Ready", icon: Search },
                                          ].map((stat) => (
                                                <div
                                                      key={stat.label}
                                                      className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
                                                >
                                                      <div className="mb-2 flex items-center gap-2">
                                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-black">
                                                                  <stat.icon
                                                                        size={13}
                                                                        strokeWidth={2.5}
                                                                  />
                                                            </span>
                                                      </div>
                                                      <p className="text-lg font-bold text-slate-900 sm:text-xl">
                                                            {stat.value}
                                                      </p>
                                                      <p className="text-[10px] tracking-wider text-slate-500 uppercase">
                                                            {stat.label}
                                                      </p>
                                                </div>
                                          ))}
                                    </div>
                              )}

                              <div
                                    className={`mb-6 grid gap-4 ${hasPie ? "grid-cols-1 md:grid-cols-5" : "grid-cols-1"}`}
                              >
                                    {hasPie && (
                                          <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:col-span-2">
                                                <p className="mb-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                                                      File breakdown
                                                </p>
                                                <div className="flex-1">
                                                      <FilePieChart pieData={pieData} />
                                                </div>
                                          </div>
                                    )}
                                    <FileDropZone
                                          uploadQueue={uploadQueue}
                                          dragOver={dragOver}
                                          colSpan={hasPie}
                                          onUpload={onUpload}
                                          onDragOver={(e) => {
                                                e.preventDefault();
                                                setDragOver(true);
                                          }}
                                          onDragLeave={() => setDragOver(false)}
                                          onDrop={(e) => {
                                                e.preventDefault();
                                                setDragOver(false);
                                                Array.from(e.dataTransfer.files).forEach(onUpload);
                                          }}
                                    />
                              </div>

                              {filesLoading ? (
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                          {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div
                                                      key={i}
                                                      className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100/60"
                                                />
                                          ))}
                                    </div>
                              ) : files.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                          <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-slate-50 text-slate-300 ring-2 ring-slate-100 sm:h-32 sm:w-32 sm:rounded-[32px]">
                                                <FolderOpen size={26} className="text-black" />
                                          </div>
                                          <p className="font-(family-name:--font-doto) text-base font-black tracking-tight text-slate-900">
                                                No files yet
                                          </p>
                                          <p className="mt-1.5 max-w-xs text-center text-sm leading-relaxed text-slate-500">
                                                Upload documents above to start building your
                                                knowledge base.
                                          </p>
                                    </div>
                              ) : (
                                    <>
                                          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-sm transition-all focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-300/15">
                                                <Search
                                                      size={14}
                                                      className="shrink-0 text-slate-400"
                                                />
                                                <input
                                                      type="text"
                                                      value={search}
                                                      onChange={(e) => setSearch(e.target.value)}
                                                      placeholder="Search files…"
                                                      className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                                                />
                                                {search && (
                                                      <span className="text-[10px] text-slate-500">
                                                            {filteredFiles.length} result
                                                            {filteredFiles.length !== 1 ? "s" : ""}
                                                      </span>
                                                )}
                                          </div>
                                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                <AnimatePresence>
                                                      {filteredFiles.map((f, i) => (
                                                            <FileCard
                                                                  key={f.file_name}
                                                                  file={f}
                                                                  index={i}
                                                                  deleting={deleting}
                                                                  onDelete={confirmDelete}
                                                            />
                                                      ))}
                                                </AnimatePresence>
                                          </div>
                                    </>
                              )}
                        </div>
                  </div>
            </motion.div>
      );
}

export default memo(FilesPanel);
