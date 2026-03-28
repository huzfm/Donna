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

/* ── Module-level Mermaid singleton ─────────────────────────────────────────
   Mermaid is imported and initialized ONCE for the lifetime of the page.
   Calling initialize() on every render() is what caused the first-render
   race condition   the module loads async while parse/render already run.
── */
type MermaidType = (typeof import("mermaid"))["default"];
let mermaidSingleton: MermaidType | null = null;
let initPromise: Promise<MermaidType> | null = null;

async function getMermaid(): Promise<MermaidType> {
  if (mermaidSingleton) return mermaidSingleton;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const mod = await import("mermaid");
    const m = mod.default;
    m.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "hsl(240,10%,9%)",
        primaryColor: "#7c3aed",
        primaryTextColor: "hsl(0,0%,90%)",
        primaryBorderColor: "#7c3aed",
        lineColor: "hsl(240,5%,45%)",
        secondaryColor: "hsl(240,6%,16%)",
        tertiaryColor: "hsl(240,6%,13%)",
        clusterBkg: "hsl(240,6%,13%)",
        titleColor: "hsl(0,0%,90%)",
        edgeLabelBackground: "hsl(240,6%,16%)",
        nodeTextColor: "hsl(0,0%,85%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: "14px",
      },
      flowchart: { curve: "basis", htmlLabels: true },
      sequence: { useMaxWidth: true },
    });
    mermaidSingleton = m;
    return m;
  })();

  return initPromise;
}

/* ── Known first-line diagram type keywords ─────────────────────────────── */
const MERMAID_STARTERS = [
  "flowchart ",
  "flowchart\n",
  "flowchart\t",
  "graph ",
  "graph\n",
  "graph\t",
  "sequencediagram",
  "erdiagram",
  "mindmap",
  "classdiagram",
  "gantt",
  "pie",
  "gitgraph",
  "statediagram",
  "journey",
  "quadrantchart",
  "requirementdiagram",
  "block",
  "xychart",
  "sankey",
  "timeline",
  "zenuml",
];

function isValidMermaid(raw: string): boolean {
  const first = raw.trim().split("\n")[0]?.trim().toLowerCase() ?? "";
  if (!first) return false;
  return MERMAID_STARTERS.some((t) => first.startsWith(t));
}

/* ── Strip fences the AI sometimes puts inside the block ────────────────── */
function stripFences(raw: string): string {
  return raw
    .replace(/```mermaid\s*/gi, "")
    .replace(/```/g, "")
    .trim();
}

/* ── Fix common LLM Mermaid mistakes ────────────────────────────────────── */
function sanitize(raw: string): string {
  const lines = raw.split("\n");
  const first = lines[0]?.trim().toLowerCase() ?? "";
  const isFlow = first.startsWith("flowchart") || first.startsWith("graph");

  return lines
    .map((line) => {
      if (isFlow) {
        // Sequence arrows → flowchart arrows (must do -->> before ->>)
        line = line.replace(/-->>/g, "-->");
        line = line.replace(/->>/g, "-->");
        line = line.replace(/==>>/g, "==>");

        // 'end' reserved keyword   replace as arrow target
        line = line.replace(
          /(-->|==>|-.->)\s*end\b(\s*:[^\n]*)?/g,
          (_, arrow, label) => `${arrow} EndNode[End${label ? label.trim() : ""}]`
        );
        // 'end' as source node at start of connection
        line = line.replace(/^(\s*)end\b(\s*(?:-->|==>))/g, "$1EndNode[End]$2");

        // 'start' reserved in some Mermaid versions
        line = line.replace(
          /(-->|==>|-.->)\s*start\b(\s*:[^\n]*)?/g,
          (_, arrow, label) => `${arrow} StartNode[Start${label ? label.trim() : ""}]`
        );
        line = line.replace(/^(\s*)start\b(\s*(?:-->|==>))/g, "$1StartNode[Start]$2");
      }

      // Strip **bold** and *italic* from node labels
      line = line.replace(/\*\*([^*\n]+)\*\*/g, "$1");
      line = line.replace(/\*([^*\n]+)\*/g, "$1");

      return line;
    })
    .join("\n");
}

/* ── Remove all Mermaid error divs Mermaid appended to <body> ──────────── */
function cleanMermaidBodyArtifacts(renderId: string) {
  // Mermaid v10/v11 appends #d{renderId} to document.body during render
  // On error it's never removed   we must do it ourselves
  try {
    const byId = document.getElementById(`d${renderId}`);
    byId?.remove();
    // Also nuke any lingering body-level divs that contain the error text
    document.querySelectorAll("body > div").forEach((el) => {
      if (el.textContent?.includes("Syntax error") || el.textContent?.includes("mermaid version")) {
        el.remove();
      }
    });
  } catch {
    // ignore DOM access errors in SSR / test environments
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MermaidDiagram   ALL hooks unconditionally before any early return
═══════════════════════════════════════════════════════════════════════════ */
export default function MermaidDiagram({ chart }: { chart: string }) {
  /* ── 1. Pure computations (not hooks) ── */
  const rawChart = stripFences(chart);
  const valid = isValidMermaid(rawChart);

  /* ── 2. ALL hooks   unconditional ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const renderCount = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(valid); // skip spinner if invalid
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
      // Use the singleton   already initialized, no race condition
      const mermaid = await getMermaid();

      const clean = sanitize(rawChart);

      // Pre-validate   throws immediately if syntax is wrong
      // without creating any DOM artifacts
      await mermaid.parse(clean);

      const { svg } = await mermaid.render(renderId, clean);

      // Always clean up body artifacts before writing to our container
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
      cleanMermaidBodyArtifacts(renderId); // clean up even on failure
      const raw = err instanceof Error ? err.message : String(err);
      // Strip the "mermaid version X.Y.Z\n" prefix Mermaid prepends to errors
      const clean = raw.replace(/mermaid version[\s\S]*?(\n|$)/, "").trim();
      setError(clean || "Failed to render diagram");
      if (containerRef.current) containerRef.current.innerHTML = "";
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]); // only chart   valid/rawChart are derived from it

  useEffect(() => {
    render();
  }, [render]);

  /* ── 3. Early return AFTER all hooks ── */
  if (!valid) return null;

  /* ── 4. Download helper ── */
  const handleDownload = () => {
    const el = containerRef.current?.querySelector("svg");
    if (!el) return;
    const blob = new Blob([new XMLSerializer().serializeToString(el)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── 5. Render ── */
  return (
    <div
      className="my-4 overflow-hidden rounded-2xl"
      style={{ border: "1px solid hsl(240,6%,20%)" }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "hsl(240,6%,14%)", borderBottom: "1px solid hsl(240,6%,20%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: "#7c3aed" }} />
          <span
            className="text-[11px] font-medium tracking-wider uppercase"
            style={{ color: "hsl(240,5%,45%)" }}
          >
            Diagram
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, +(z - 0.2).toFixed(1)))}
            className="rounded-lg p-1.5 transition-all"
            style={{ color: "hsl(240,5%,45%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(0,0%,80%)";
              e.currentTarget.style.background = "hsl(240,6%,20%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(240,5%,45%)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Zoom out"
          >
            <ZoomOut size={13} />
          </button>

          <span
            className="min-w-[36px] px-1 text-center text-[10px]"
            style={{ color: "hsl(240,5%,45%)" }}
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
            className="rounded-lg p-1.5 transition-all"
            style={{ color: "hsl(240,5%,45%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(0,0%,80%)";
              e.currentTarget.style.background = "hsl(240,6%,20%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(240,5%,45%)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Zoom in"
          >
            <ZoomIn size={13} />
          </button>

          <button
            onClick={render}
            className="ml-1 rounded-lg p-1.5 transition-all"
            style={{ color: "hsl(240,5%,45%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(0,0%,80%)";
              e.currentTarget.style.background = "hsl(240,6%,20%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(240,5%,45%)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Re-render"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleDownload}
            className="rounded-lg p-1.5 transition-all"
            style={{ color: "hsl(240,5%,45%)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "hsl(0,0%,80%)";
              e.currentTarget.style.background = "hsl(240,6%,20%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "hsl(240,5%,45%)";
              e.currentTarget.style.background = "transparent";
            }}
            title="Download SVG"
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Canvas   always mounted */}
      <div
        className="relative overflow-auto"
        style={{ background: "hsl(240,10%,10%)", minHeight: error ? 0 : 120 }}
      >
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 10, background: "hsl(240,10%,10%)" }}
          >
            <div className="flex items-center gap-2" style={{ color: "hsl(240,5%,40%)" }}>
              <RefreshCw size={14} className="animate-spin" />
              <span className="text-xs">Rendering diagram…</span>
            </div>
          </div>
        )}

        {/* SVG target   always in DOM, hidden when errored */}
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

      {/* Collapsible error   compact, non-intrusive */}
      {error && (
        <div style={{ borderTop: "1px solid hsl(240,6%,20%)" }}>
          <button
            onClick={() => setShowErr((v) => !v)}
            className="flex w-full items-center gap-2 px-4 py-2 text-left transition-all"
            style={{ background: "hsl(240,6%,13%)", color: "hsl(30,90%,60%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(240,6%,16%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "hsl(240,6%,13%)")}
          >
            <AlertTriangle size={12} />
            <span className="flex-1 text-[11px] font-medium">
              Diagram syntax error   click to inspect
            </span>
            {showErr ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showErr && (
            <div className="px-4 py-3" style={{ background: "hsl(240,6%,11%)" }}>
              <pre
                className="mb-3 text-[11px] leading-relaxed whitespace-pre-wrap"
                style={{ color: "hsl(0,0%,50%)" }}
              >
                {error}
              </pre>
              <pre
                className="overflow-x-auto rounded-lg px-3 py-2 text-[11px]"
                style={{ background: "hsl(240,6%,14%)", color: "hsl(240,5%,50%)" }}
              >
                {rawChart}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
