import { Mail, Inbox, FileSearch, Hash, AtSign, HelpCircle, MessageSquare, FileText } from "lucide-react";

/* ─── Types ─── */

export interface UploadedFile { file_name: string; uploaded_at: string; }

export interface ChatSession { id: string; title: string; created_at: string; updated_at: string; }

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  status?: "done" | "cancelled";
}

export interface SlashCommand {
  trigger: string;
  label: string;
  icon: React.ElementType;
  description: string;
  fill: string;
}

/* ─── Constants ─── */

export const SLASH_COMMANDS: SlashCommand[] = [
  { trigger: "/email", label: "/email", icon: Mail, description: "Send an email to someone", fill: "/email to: [recipient] subject: [subject] body: [message]" },
  { trigger: "/inbox", label: "/inbox", icon: Inbox, description: "Check & summarize your Gmail inbox", fill: "Check my emails and summarize my inbox" },
  { trigger: "/summarize", label: "/summarize", icon: FileSearch, description: "Summarize an uploaded document", fill: "Summarize the uploaded document" },
  { trigger: "/find", label: "/find", icon: Hash, description: "Find specific info in your documents", fill: "Find information about " },
  { trigger: "/draft", label: "/draft", icon: AtSign, description: "Draft a reply to an email", fill: "Draft a reply to the latest email from " },
  { trigger: "/help", label: "/help", icon: HelpCircle, description: "Show all available commands", fill: "Show me what you can do" },
];

export type TabId = "chat" | "files" | "gmail";

export const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "files", label: "Files", icon: FileText },
  { id: "gmail", label: "Gmail", icon: Mail },
];

/* ─── Utils ─── */

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function preprocessSlashCommand(raw: string): string {
  const text = raw.trim();
  if (/^\/email/i.test(text)) {
    const field = (key: string) => {
      const re = new RegExp(`${key}:\\s*\\[?([^\\]\\n]+?)\\]?(?:\\s+(?:subject|body|to):|$)`, "i");
      return text.match(re)?.[1]?.trim() ?? "";
    };
    const to = field("to"), subject = field("subject"), body = field("body");
    if (!to) return "I couldn't parse the /email command. Format: /email to: [recipient] subject: [subject] body: [message]";
    return `Send an email to ${to}${subject ? ` with subject "${subject}"` : ""}${body ? ` and body: ${body}` : ""}`;
  }
  if (/^\/inbox/i.test(text)) return "Check my emails and summarize my inbox";
  if (/^\/summarize/i.test(text)) { const r = text.replace(/^\/summarize/i, "").trim(); return r ? `Summarize ${r}` : "Summarize the uploaded documents"; }
  if (/^\/find/i.test(text)) { const r = text.replace(/^\/find/i, "").trim(); return r ? `Find information about ${r}` : "Find the key facts in my uploaded documents"; }
  if (/^\/draft/i.test(text)) { const r = text.replace(/^\/draft/i, "").trim(); return r ? `Draft a reply to the latest email from ${r}` : "Draft a reply to the latest email"; }
  if (/^\/help/i.test(text)) return "Show me all the things you can help me with";
  return text;
}

export function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText size={16} className="text-red-500" />;
  if (ext === "doc" || ext === "docx") return <FileText size={16} className="text-blue-500" />;
  if (ext === "xls" || ext === "xlsx" || ext === "csv") return <FileText size={16} className="text-green-600" />;
  return <FileText size={16} className="text-neutral-400" />;
}
