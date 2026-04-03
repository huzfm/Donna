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
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200">
      {/* Code header */}
      <div className="flex items-center justify-between border-b border-slate-200/90 bg-slate-50/80 px-4 py-2">
        <span className="font-mono text-[11px] font-medium text-slate-500">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900"
        >
          {copied ? <Check size={11} className="text-black" /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code body */}
      <pre className="[margin:0] overflow-x-auto bg-slate-50 px-4 py-3.5 text-[13px] leading-relaxed text-slate-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── Inline code ── */
function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="rounded-md border border-slate-300/80 bg-slate-100/80 px-1.5 py-0.5 font-mono text-[13px] text-black">
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
          <h1 className="mt-5 mb-2 border-b border-slate-200 pb-2 text-xl font-bold text-slate-900">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2 text-lg font-semibold text-slate-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-3 mb-1.5 text-base font-semibold text-slate-900">{children}</h3>
        ),

        /* Paragraph */
        p: ({ children }) => (
          <p className="mb-3 text-[14.5px] leading-[1.8] text-slate-700 last:mb-0">{children}</p>
        ),

        /* Bold & Italic */
        strong: ({ children }) => (
          <strong className="font-semibold text-slate-900">{children}</strong>
        ),
        em: ({ children }) => <em className="text-slate-600 italic">{children}</em>,

        /* Unordered list */
        ul: ({ children }) => <ul className="my-2 list-none space-y-1.5 pl-1">{children}</ul>,

        /* Ordered list */
        ol: ({ children }) => <ol className="my-2 space-y-1.5 pl-5 text-black">{children}</ol>,

        li: ({ children, ...props }) => {
          // @ts-expect-error  node provided by react-markdown
          const isOrdered = props?.node?.parent?.tagName === "ol";
          return (
            <li className="flex items-start gap-2.5 text-[14px] leading-relaxed text-slate-700">
              {!isOrdered && (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-800" />
              )}
              <span className={isOrdered ? "ml-0.5 list-item list-decimal" : ""}>{children}</span>
            </li>
          );
        },

        /* Blockquote */
        blockquote: ({ children }) => (
          <blockquote className="my-3 rounded-r-lg border-l-[3px] border-slate-300 bg-slate-100/50 py-2 pl-4 text-[14px] text-slate-600 italic">
            {children}
          </blockquote>
        ),

        /* Horizontal rule */
        hr: () => <hr className="my-4 border-slate-200" />,

        /* Links */
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline underline-offset-2 transition-colors hover:text-black"
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
              <Suspense
                fallback={
                  <div className="my-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6">
                    <RefreshCw size={14} className="animate-spin text-slate-500" />
                    <span className="text-xs text-slate-500">Loading diagram…</span>
                  </div>
                }
              >
                <MermaidDiagram chart={code} />
              </Suspense>
            );
          }

          // ── Code block ──
          // @ts-expect-error  react-markdown passes inline prop but types vary
          const isInline = props.inline;
          if (!isInline && className?.startsWith("language-")) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
          }
          return <InlineCode>{children}</InlineCode>;
        },
        pre: ({ children }) => <>{children}</>,

        /* Table */
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-[13px]">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
        th: ({ children }) => (
          <th className="border-b border-slate-200 px-4 py-2.5 text-left text-[12px] font-semibold tracking-wide text-slate-600 uppercase">
            {children}
          </th>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
            {children}
          </tr>
        ),
        td: ({ children }) => <td className="px-4 py-2.5 text-slate-700">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
