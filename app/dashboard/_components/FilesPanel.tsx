"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Clock, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { UploadedFile, fileIcon, timeAgo } from "./types";

/* ─── File Categories ─── */

const FILE_CATEGORIES: { key: string; label: string; extensions: string[]; color: string; dotColor: string }[] = [
  { key: "pdf",   label: "PDF Documents",  extensions: ["pdf"],                color: "text-red-600",     dotColor: "bg-red-500" },
  { key: "word",  label: "Word Documents", extensions: ["doc", "docx"],        color: "text-blue-600",    dotColor: "bg-blue-500" },
  { key: "sheet", label: "Spreadsheets",   extensions: ["xls", "xlsx", "csv"], color: "text-green-600",   dotColor: "bg-green-500" },
  { key: "text",  label: "Text Files",     extensions: ["txt"],                color: "text-neutral-600", dotColor: "bg-neutral-400" },
  { key: "other", label: "Other Files",    extensions: [],                     color: "text-neutral-500", dotColor: "bg-neutral-300" },
];

function getFileCategory(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  for (const cat of FILE_CATEGORIES) {
    if (cat.extensions.includes(ext)) return cat.key;
  }
  return "other";
}

/* ─── FilesPanel ─── */

export default function FilesPanel({ files, filesLoading, uploading, onUpload, onDelete }: {
  files: UploadedFile[]; filesLoading: boolean; uploading: boolean; onUpload: (f: File) => void; onDelete: (name: string) => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const confirmDelete = async (fileName: string) => {
    setDeleting(fileName);
    await onDelete(fileName);
    setDeleting(null);
  };

  const grouped = FILE_CATEGORIES.map(cat => ({
    ...cat,
    files: files.filter(f => getFileCategory(f.file_name) === cat.key),
  })).filter(g => g.files.length > 0);

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }} className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="border-b border-neutral-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-neutral-900">Knowledge Base</h1>
          {files.length > 0 && (
            <p className="text-[11px] text-neutral-400">{files.length} file{files.length !== 1 ? "s" : ""} across {grouped.length} {grouped.length === 1 ? "category" : "categories"}</p>
          )}
        </div>
        <label className="flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-medium px-3.5 py-2 rounded-lg cursor-pointer transition-colors">
          <Upload size={13} />
          {uploading ? "Uploading…" : "Upload"}
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv" multiple onChange={e => Array.from(e.target.files || []).forEach(onUpload)} />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <label className="block border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 group">
          <input type="file" accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv" className="hidden" multiple onChange={e => Array.from(e.target.files || []).forEach(onUpload)} />
          <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center mx-auto mb-3 transition-colors">
            <Upload size={18} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          </div>
          <p className="text-sm text-neutral-500 mb-1">
            {uploading ? <span className="text-neutral-800 animate-pulse">Processing…</span> : "Click or drag files here"}
          </p>
          <p className="text-xs text-neutral-400">PDF · Word · Excel · CSV · TXT</p>
        </label>

        {filesLoading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 shimmer-bg rounded-lg" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={28} className="text-neutral-300 mx-auto mb-3" />
            <p className="text-sm text-neutral-500">No files yet</p>
            <p className="text-xs text-neutral-400 mt-1">Upload documents to build your knowledge base</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(group => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${group.dotColor}`} />
                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${group.color}`}>{group.label}</h3>
                  <span className="text-[10px] text-neutral-300 bg-neutral-100 rounded-full px-1.5 py-0.5 font-medium">{group.files.length}</span>
                </div>
                <div className="space-y-1.5">
                  {group.files.map((f, i) => (
                    <motion.div key={`${f.file_name}-${i}`}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg px-4 py-3 transition-colors group">
                      <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">{fileIcon(f.file_name)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{f.file_name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock size={9} className="text-neutral-300" />
                          <span className="text-[11px] text-neutral-400">{timeAgo(f.uploaded_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${f.file_name}" from your knowledge base? This cannot be undone.`)) {
                              confirmDelete(f.file_name);
                            }
                          }}
                          disabled={deleting === f.file_name}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all disabled:opacity-50"
                          title="Delete file">
                          {deleting === f.file_name ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
