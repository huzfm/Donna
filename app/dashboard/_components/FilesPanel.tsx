"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Clock,
  Trash2,
  Loader2,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  FileType2,
  File,
  FolderOpen,
  Plus,
  HardDrive,
  Search,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { UploadedFile, timeAgo } from "./types";

function getFileCategory(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf")
    return { label: "PDF", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)", icon: FileType2 };
  if (["doc", "docx"].includes(ext))
    return { label: "Word", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.18)", icon: FileText };
  if (["xls", "xlsx", "csv"].includes(ext))
    return { label: "Sheet", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.18)", icon: FileSpreadsheet };
  if (ext === "txt")
    return { label: "Text", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.18)", icon: FileText };
  return { label: "File", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.18)", icon: File };
}

const PIE_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#94a3b8"];

export default function FilesPanel({
  files,
  filesLoading,
  uploading,
  onUpload,
  onDelete,
}: {
  files: UploadedFile[];
  filesLoading: boolean;
  uploading: boolean;
  onUpload: (f: File) => void;
  onDelete: (name: string) => void;
}) {
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

  const confirmDelete = async (fileName: string) => {
    if (!window.confirm(`Delete "${fileName}"?`)) return;
    setDeleting(fileName);
    await onDelete(fileName);
    setDeleting(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(onUpload);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex flex-1 flex-col overflow-hidden bg-transparent"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/60 pl-14 md:pl-6 pr-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-black ring-1 ring-slate-300/60">
            <Database size={15} strokeWidth={2} />
          </span>
          <div>
            <h1 className="font-(family-name:--font-doto) text-sm font-black tracking-tight text-slate-950">
              Knowledge base
            </h1>
            <p className="text-[11px] text-slate-500">
              {files.length} document{files.length !== 1 ? "s" : ""} indexed
            </p>
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-300/25 transition-all hover:ring-2 hover:ring-slate-300/20">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} strokeWidth={2.5} />}
          {uploading ? "Uploading…" : "Add files"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
            multiple
            onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-6">

          {/* Stats row   only when files exist */}
          {files.length > 0 && (
            <div className="mb-6 grid grid-cols-4 gap-3">
              {/* Stat cards */}
              {[
                { label: "Total files", value: files.length, icon: Database, color: "slate" },
                { label: "File types", value: pieData.length, icon: HardDrive, color: "slate" },
                { label: "Indexed", value: files.length, icon: CheckCircle2, color: "slate" },
                { label: "Status", value: "Ready", icon: Search, color: "slate" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-black">
                      <stat.icon size={13} strokeWidth={2.5} />
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-[10px] tracking-wider text-slate-500 uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chart + Upload row */}
          <div className={`mb-6 grid gap-4 ${files.length > 0 && pieData.length > 0 ? "grid-cols-5" : "grid-cols-1"}`}>
            {/* Pie chart   2/5 width */}
            {files.length > 0 && pieData.length > 0 && (
              <div className="col-span-2 flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <p className="mb-3 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  File breakdown
                </p>
                <div className="flex-1">
                  <div className="mx-auto h-35 w-35">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={58}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontSize: "12px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {pieData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      {d.name} · {d.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Upload drop zone   3/5 or full */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`${files.length > 0 && pieData.length > 0 ? "col-span-3" : "col-span-1"} flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
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
                onChange={(e) => Array.from(e.target.files || []).forEach(onUpload)}
              />
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 ring-1 ring-slate-300/60">
                {uploading ? (
                  <Loader2 size={24} className="animate-spin text-black" />
                ) : (
                  <Upload size={24} className="text-black" />
                )}
              </div>
              {uploading ? (
                <p className="animate-pulse text-sm font-medium text-slate-600">Processing…</p>
              ) : dragOver ? (
                <p className="text-sm font-semibold text-black">Release to upload</p>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drop files here or click to browse
                    </p>
                    <p className="mt-1 text-xs text-slate-500">PDF · Word · Excel · CSV · TXT</p>
                  </div>
                  <div className="flex items-center gap-1.5">
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
          </div>

          {/* Search + File list */}
          {filesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-100/60"
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-slate-100/80 ring-1 ring-slate-300/50">
                <FolderOpen size={26} className="text-black" />
              </div>
              <p className="font-(family-name:--font-doto) text-base font-black tracking-tight text-slate-900">
                No files yet
              </p>
              <p className="mt-1.5 max-w-xs text-center text-sm leading-relaxed text-slate-500">
                Upload documents above to start building your knowledge base.
              </p>
            </div>
          ) : (
            <>
              {/* Search bar */}
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-sm transition-all focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-300/15">
                <Search size={14} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files…"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                {search && (
                  <span className="text-[10px] text-slate-500">
                    {filteredFiles.length} result{filteredFiles.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* File grid   cards instead of rows */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredFiles.map((f, i) => {
                    const cat = getFileCategory(f.file_name);
                    const Icon = cat.icon;
                    return (
                      <motion.div
                        key={`${f.file_name}-${i}`}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03, duration: 0.15 }}
                        className="group relative flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-150 hover:border-slate-300 hover:shadow-md"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                        >
                          <Icon size={16} style={{ color: cat.color }} />
                        </div>
                        <div className="min-w-0 flex-1 max-w-64">
                          <p className="truncate text-[13px] font-semibold text-slate-900">
                            {f.file_name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase"
                              style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}
                            >
                              {cat.label}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock size={8} />
                              {timeAgo(f.uploaded_at)}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-black">
                            <CheckCircle2 size={10} />
                            <span>Indexed</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => confirmDelete(f.file_name)}
                          disabled={deleting === f.file_name}
                          title="Delete"
                          className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        >
                          {deleting === f.file_name ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
