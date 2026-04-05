"use client";

import { useState, useRef, useCallback } from "react";
import { UploadedFile } from "../_components/types";
import type { UsageData } from "./useUsage";

interface UseUploadOptions {
      setUsage: (updater: (prev: UsageData | null) => UsageData | null) => void;
      setUpgradeOpen: (v: boolean) => void;
}

export interface UploadQueueItem {
      id: string;
      name: string;
      status: "uploading" | "done" | "error";
      error?: string;
}

export function useUpload({ setUsage, setUpgradeOpen }: UseUploadOptions) {
      const [savedFiles, setSavedFiles] = useState<UploadedFile[]>([]);
      const [filesLoading, setFilesLoading] = useState(true);
      const [uploading, setUploading] = useState(false);
      const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
      const fileInputRef = useRef<HTMLInputElement>(null);

      const loadFiles = useCallback(async () => {
            try {
                  const r = await fetch("/api/upload");
                  const { files } = await r.json();
                  if (Array.isArray(files)) setSavedFiles(files);
            } finally {
                  setFilesLoading(false);
            }
      }, []);

      const handleUpload = useCallback(
            async (file: File) => {
                  const qid = `${Date.now()}-${file.name}`;
                  setUploadQueue((q) => [...q, { id: qid, name: file.name, status: "uploading" }]);
                  setUploading(true);
                  const fd = new FormData();
                  fd.append("file", file);
                  try {
                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (res.status === 402 && data.error === "free_limit_reached") {
                              setUploadQueue((q) =>
                                    q.map((item) =>
                                          item.id === qid
                                                ? {
                                                        ...item,
                                                        status: "error",
                                                        error: "Upload limit reached",
                                                  }
                                                : item
                                    )
                              );
                              setTimeout(
                                    () =>
                                          setUploadQueue((q) =>
                                                q.filter((item) => item.id !== qid)
                                          ),
                                    4000
                              );
                              setUpgradeOpen(true);
                              return;
                        }
                        if (!res.ok) {
                              const msg = data.error || "Upload failed";
                              setUploadQueue((q) =>
                                    q.map((item) =>
                                          item.id === qid
                                                ? { ...item, status: "error", error: msg }
                                                : item
                                    )
                              );
                              setTimeout(
                                    () =>
                                          setUploadQueue((q) =>
                                                q.filter((item) => item.id !== qid)
                                          ),
                                    4000
                              );
                              return;
                        }
                        setUploadQueue((q) =>
                              q.map((item) =>
                                    item.id === qid ? { ...item, status: "done" } : item
                              )
                        );
                        setTimeout(
                              () => setUploadQueue((q) => q.filter((item) => item.id !== qid)),
                              3000
                        );
                        setUsage((prev) =>
                              prev ? { ...prev, uploads_used: prev.uploads_used + 1 } : prev
                        );
                        setSavedFiles((prev) => [
                              { file_name: file.name, uploaded_at: new Date().toISOString() },
                              ...prev.filter((f) => f.file_name !== file.name),
                        ]);
                  } catch {
                        setUploadQueue((q) =>
                              q.map((item) =>
                                    item.id === qid
                                          ? { ...item, status: "error", error: "Upload failed" }
                                          : item
                              )
                        );
                        setTimeout(
                              () => setUploadQueue((q) => q.filter((item) => item.id !== qid)),
                              4000
                        );
                  } finally {
                        // uploading is derived from uploadQueue, no manual reset needed
                  }
            },
            [setUsage, setUpgradeOpen]
      );

      const handleDelete = useCallback(async (fileName: string) => {
            try {
                  const res = await fetch("/api/upload", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ file_name: fileName }),
                  });
                  if (!res.ok) {
                        const d = await res.json();
                        alert(d.error || "Delete failed");
                        return;
                  }
                  setSavedFiles((prev) => prev.filter((f) => f.file_name !== fileName));
            } catch {
                  alert("Delete failed");
            }
      }, []);

      return {
            savedFiles,
            setSavedFiles,
            filesLoading,
            uploading,
            uploadQueue,
            fileInputRef,
            loadFiles,
            handleUpload,
            handleDelete,
      };
}