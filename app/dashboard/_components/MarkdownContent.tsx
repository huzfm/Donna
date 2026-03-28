"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, lazy, Suspense } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const MermaidDiagram = lazy(() => import("./MermaidDiagram"));

/* ── Code block with copy ── */
function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const code = String(children ?? "").replace(/\n$/, "");
  const language = (className ?? "").replace("language-", "") || "text";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden" style={{ border: "1px solid hsl(240,6%,20%)" }}>
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background: "hsl(240,6%,15%)", borderBottom: "1px solid hsl(240,6%,20%)" }}>
        <span className="text-[11px] font-mono font-medium" style={{ color: "hsl(240,5%,45%)" }}>
          {language}
        </span>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md transition-all"
          style={{ color: "hsl(240,5%,45%)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "hsl(0,0%,80%)"; e.currentTarget.style.background = "hsl(240,6%,20%)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "hsl(240,5%,45%)"; e.currentTarget.style.background = "transparent"; }}
        >
          {copied ? <Check size={11} style={{ color: "#34d399" }} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code body */}
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed"
        style={{ background: "hsl(240,6%,11%)", color: "hsl(210,20%,85%)", margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Inline code ── */
function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code
      className="text-[13px] font-mono px-1.5 py-0.5 rounded-md"
      style={{ background: "hsl(240,6%,18%)", color: "#a78bfa", border: "1px solid hsl(240,6%,24%)" }}
    >
      {children}
    </code>
  );
}

/* ── Main MarkdownContent ── */
export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        /* Headings */
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mt-5 mb-2 pb-2" style={{ color: "hsl(0,0%,92%)", borderBottom: "1px solid hsl(240,6%,18%)" }}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold mt-4 mb-2" style={{ color: "hsl(0,0%,90%)" }}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold mt-3 mb-1.5" style={{ color: "hsl(0,0%,88%)" }}>{children}</h3>
        ),

        /* Paragraph */
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-[1.8] text-[14.5px]" style={{ color: "hsl(0,0%,83%)" }}>{children}</p>
        ),

        /* Bold & Italic */
        strong: ({ children }) => (
          <strong className="font-semibold" style={{ color: "hsl(0,0%,94%)" }}>{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic" style={{ color: "hsl(0,0%,80%)" }}>{children}</em>
        ),

        /* Unordered list */
        ul: ({ children }) => (
          <ul className="my-2 space-y-1.5 pl-1 list-none">{children}</ul>
        ),

        /* Ordered list */
        ol: ({ children }) => (
          <ol className="my-2 space-y-1.5 pl-5" style={{ color: "#a78bfa" }}>{children}</ol>
        ),

        li: ({ children, ...props }) => {
          // @ts-expect-error – node provided by react-markdown
          const isOrdered = props?.node?.parent?.tagName === "ol";
          return (
            <li className="flex items-start gap-2.5 text-[14px] leading-relaxed" style={{ color: "hsl(0,0%,82%)" }}>
              {!isOrdered && (
                <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#7c3aed" }} />
              )}
              <span className={isOrdered ? "list-item list-decimal ml-0.5" : ""}>{children}</span>
            </li>
          );
        },

        /* Blockquote */
        blockquote: ({ children }) => (
          <blockquote
            className="my-3 pl-4 py-2 rounded-r-lg text-[14px] italic"
            style={{ borderLeft: "3px solid #7c3aed", background: "hsl(240,6%,13%)", color: "hsl(0,0%,70%)" }}
          >
            {children}
          </blockquote>
        ),

        /* Horizontal rule */
        hr: () => <hr className="my-4" style={{ borderColor: "hsl(240,6%,20%)" }} />,

        /* Links */
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors"
            style={{ color: "#818cf8" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#a5b4fc")}
            onMouseLeave={e => (e.currentTarget.style.color = "#818cf8")}
          >
            {children}
          </a>
        ),

        code: ({ className, children, ...props }) => {
          const language = (className ?? "").replace("language-", "");
          const code = String(children ?? "").replace(/\n$/, "");

          // ── Mermaid: render as diagram ──
          if (language === "mermaid") {
            return (
              <Suspense fallback={
                <div className="my-4 flex items-center gap-2 px-4 py-6 rounded-2xl" style={{ background: "hsl(240,6%,13%)", border: "1px solid hsl(240,6%,20%)" }}>
                  <RefreshCw size={14} className="animate-spin" style={{ color: "hsl(240,5%,45%)" }} />
                  <span className="text-xs" style={{ color: "hsl(240,5%,45%)" }}>Loading diagram…</span>
                </div>
              }>
                <MermaidDiagram chart={code} />
              </Suspense>
            );
          }

          // ── Code block ──
          // @ts-expect-error – react-markdown passes inline prop but types vary
          const isInline = props.inline;
          if (!isInline && className?.startsWith("language-")) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
          }
          return <InlineCode>{children}</InlineCode>;
        },
        pre: ({ children }) => <>{children}</>,

        /* Table */
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl" style={{ border: "1px solid hsl(240,6%,20%)" }}>
            <table className="w-full text-[13px] border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ background: "hsl(240,6%,15%)" }}>{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-left font-semibold text-[12px] uppercase tracking-wide"
            style={{ color: "hsl(240,5%,55%)", borderBottom: "1px solid hsl(240,6%,20%)" }}>
            {children}
          </th>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr style={{ borderBottom: "1px solid hsl(240,6%,16%)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "hsl(240,6%,13%)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {children}
          </tr>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5" style={{ color: "hsl(0,0%,80%)" }}>{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
