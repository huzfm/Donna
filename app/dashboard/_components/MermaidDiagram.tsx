"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
      Download,
      RefreshCw,
      ZoomIn,
      ZoomOut,
      AlertTriangle,
      ChevronDown,
      ChevronUp,
} from "lucide-react";
import {
      getMermaid,
      isValidMermaid,
      stripFences,
      sanitize,
      cleanMermaidBodyArtifacts,
} from "@/lib/ui/mermaid-engine";

export default function MermaidDiagram({ chart }: { chart: string }) {
      const rawChart = stripFences(chart);
      const valid = isValidMermaid(rawChart);

      const containerRef = useRef<HTMLDivElement>(null);
      const renderCount = useRef(0);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(valid);
      const [zoom, setZoom] = useState(1);
      const [showErr, setShowErr] = useState(false);

      const render = useCallback(async () => {
            if (!valid) {
                  setLoading(false);
                  return;
            }

            setLoading(true);
            setError(null);
            setShowErr(false);
            renderCount.current += 1;
            const renderId = `mermaid-${Date.now()}-${renderCount.current}`;

            try {
                  const mermaid = await getMermaid();
                  const clean = sanitize(rawChart);
                  await mermaid.parse(clean);
                  const { svg } = await mermaid.render(renderId, clean);
                  cleanMermaidBodyArtifacts(renderId);

                  if (containerRef.current) {
                        containerRef.current.innerHTML = svg;
                        const el = containerRef.current.querySelector("svg");
                        if (el) {
                              el.style.width = "100%";
                              el.style.height = "auto";
                              el.style.maxWidth = "100%";
                        }
                  }
            } catch (err) {
                  cleanMermaidBodyArtifacts(renderId);
                  const raw = err instanceof Error ? err.message : String(err);
                  const clean = raw.replace(/mermaid version[\s\S]*?(\n|$)/, "").trim();
                  setError(clean || "Failed to render diagram");
                  if (containerRef.current) containerRef.current.innerHTML = "";
            } finally {
                  setLoading(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [chart]);

      useEffect(() => {
            render();
      }, [render]);

      if (!valid) return null;

      const handleDownload = () => {
            const el = containerRef.current?.querySelector("svg");
            if (!el) return;
            const blob = new Blob([new XMLSerializer().serializeToString(el)], {
                  type: "image/svg+xml",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "diagram.svg";
            a.click();
            URL.revokeObjectURL(url);
      };

      return (
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                        <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-violet-600" />
                              <span className="text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                                    Diagram
                              </span>
                        </div>
                        <div className="flex items-center gap-1">
                              <button
                                    onClick={() =>
                                          setZoom((z) => Math.max(0.3, +(z - 0.2).toFixed(1)))
                                    }
                                    className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
                                    title="Zoom out"
                              >
                                    <ZoomOut size={13} />
                              </button>
                              <span className="min-w-[36px] px-1 text-center text-[10px] text-slate-500">
                                    {Math.round(zoom * 100)}%
                              </span>
                              <button
                                    onClick={() =>
                                          setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))
                                    }
                                    className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
                                    title="Zoom in"
                              >
                                    <ZoomIn size={13} />
                              </button>
                              <button
                                    onClick={render}
                                    className="ml-1 rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
                                    title="Re-render"
                              >
                                    <RefreshCw
                                          size={13}
                                          className={loading ? "animate-spin" : ""}
                                    />
                              </button>
                              <button
                                    onClick={handleDownload}
                                    className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
                                    title="Download SVG"
                              >
                                    <Download size={13} />
                              </button>
                        </div>
                  </div>

                  <div
                        className="relative overflow-auto bg-white"
                        style={{ minHeight: error ? 0 : 120 }}
                  >
                        {loading && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                                    <div className="flex items-center gap-2 text-slate-500">
                                          <RefreshCw size={14} className="animate-spin" />
                                          <span className="text-xs">Rendering diagram…</span>
                                    </div>
                              </div>
                        )}
                        <div
                              ref={containerRef}
                              className="p-4"
                              style={{
                                    transform: `scale(${zoom})`,
                                    transformOrigin: "center top",
                                    display: error ? "none" : "block",
                              }}
                        />
                  </div>

                  {error && (
                        <div className="border-t border-slate-200">
                              <button
                                    onClick={() => setShowErr((v) => !v)}
                                    className="flex w-full items-center gap-2 bg-amber-50 px-4 py-2 text-left text-amber-800 transition-all hover:bg-amber-100"
                              >
                                    <AlertTriangle size={12} />
                                    <span className="flex-1 text-[11px] font-medium">
                                          Diagram syntax error — click to inspect
                                    </span>
                                    {showErr ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                              {showErr && (
                                    <div className="bg-slate-50 px-4 py-3">
                                          <pre className="mb-3 text-[11px] leading-relaxed whitespace-pre-wrap text-slate-600">
                                                {error}
                                          </pre>
                                          <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
                                                {rawChart}
                                          </pre>
                                    </div>
                              )}
                        </div>
                  )}
            </div>
      );
}
