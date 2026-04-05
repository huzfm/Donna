type MermaidType = (typeof import("mermaid"))["default"];

let mermaidSingleton: MermaidType | null = null;
let initPromise: Promise<MermaidType> | null = null;

export async function getMermaid(): Promise<MermaidType> {
      if (mermaidSingleton) return mermaidSingleton;
      if (initPromise) return initPromise;

      initPromise = (async () => {
            const mod = await import("mermaid");
            const m = mod.default;
            m.initialize({
                  startOnLoad: false,
                  suppressErrorRendering: true,
                  theme: "neutral",
                  themeVariables: {
                        darkMode: false,
                        background: "#ffffff",
                        primaryColor: "#ede9fe",
                        primaryTextColor: "#1e293b",
                        primaryBorderColor: "#7c3aed",
                        lineColor: "#64748b",
                        secondaryColor: "#f1f5f9",
                        tertiaryColor: "#f8fafc",
                        clusterBkg: "#f8fafc",
                        titleColor: "#0f172a",
                        edgeLabelBackground: "#f1f5f9",
                        nodeTextColor: "#334155",
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

export function isValidMermaid(raw: string): boolean {
      const first = raw.trim().split("\n")[0]?.trim().toLowerCase() ?? "";
      if (!first) return false;
      return MERMAID_STARTERS.some((t) => first.startsWith(t));
}

export function stripFences(raw: string): string {
      return raw
            .replace(/```mermaid\s*/gi, "")
            .replace(/```/g, "")
            .trim();
}

export function sanitize(raw: string): string {
      const lines = raw.split("\n");
      const first = lines[0]?.trim().toLowerCase() ?? "";
      const isFlow = first.startsWith("flowchart") || first.startsWith("graph");

      return lines
            .map((line) => {
                  if (isFlow) {
                        line = line.replace(/-->>/g, "-->");
                        line = line.replace(/->>/g, "-->");
                        line = line.replace(/==>>/g, "==>");
                        line = line.replace(
                              /(-->|==>|-.->)\s*end\b(\s*:[^\n]*)?/g,
                              (_, arrow, label) =>
                                    `${arrow} EndNode[End${label ? label.trim() : ""}]`
                        );
                        line = line.replace(/^(\s*)end\b(\s*(?:-->|==>))/g, "$1EndNode[End]$2");
                        line = line.replace(
                              /(-->|==>|-.->)\s*start\b(\s*:[^\n]*)?/g,
                              (_, arrow, label) =>
                                    `${arrow} StartNode[Start${label ? label.trim() : ""}]`
                        );
                        line = line.replace(
                              /^(\s*)start\b(\s*(?:-->|==>))/g,
                              "$1StartNode[Start]$2"
                        );
                  }
                  line = line.replace(/\*\*([^*\n]+)\*\*/g, "$1");
                  line = line.replace(/\*([^*\n]+)\*/g, "$1");
                  return line;
            })
            .join("\n");
}

export function cleanMermaidBodyArtifacts(renderId: string) {
      try {
            document.getElementById(`d${renderId}`)?.remove();
            document.querySelectorAll("body > div").forEach((el) => {
                  if (
                        el.textContent?.includes("Syntax error") ||
                        el.textContent?.includes("mermaid version")
                  ) {
                        el.remove();
                  }
            });
      } catch {
            // ignore DOM errors in SSR
      }
}
