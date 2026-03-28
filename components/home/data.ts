import {
  Brain,
  FileText,
  Mail,
  MessageSquare,
  Upload,
  Zap,
  Lock,
  Search,
  Globe,
  BarChart3,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";

export const features = [
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents, get summaries, and extract insights using advanced RAG technology.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "#059669",
    tag: "Core",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload PDFs, Word docs, Excel files, and more. Donna indexes and understands your content instantly.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "#2563eb",
    tag: "Upload",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Read your Gmail inbox, draft responses, and send emails   all through natural conversation.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "#d97706",
    tag: "Gmail",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description:
      "Find exactly what you need across all your documents using meaning-based vector search, not just keywords.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    accent: "#0891b2",
    tag: "Search",
  },
  {
    icon: Globe,
    title: "Multi-Format Support",
    description:
      "Works with PDF, Word, Excel, CSV, and plain text. Upload anything and start asking questions immediately.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    accent: "#db2777",
    tag: "Files",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your documents and credentials are encrypted and stored privately. Only you can access your data.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    accent: "#7c3aed",
    tag: "Security",
  },
];

export const stats = [
  {
    value: "10+",
    label: "File formats supported",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    value: "< 3s",
    label: "Average response time",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    value: "100%",
    label: "Private & encrypted",
    icon: Lock,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    value: "24/7",
    label: "Always available",
    icon: Clock,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export const useCases = [
  {
    icon: BarChart3,
    title: "Research & Analysis",
    description:
      "Upload research papers and reports. Ask Donna to summarize findings, compare data, and extract key takeaways.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "#2563eb",
    detail: "PDF, Word, Excel   all supported",
  },
  {
    icon: Mail,
    title: "Email Productivity",
    description:
      "Connect your Gmail and let Donna read, summarize, draft replies, and send emails through simple chat commands.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "#d97706",
    detail: "Gmail integration built-in",
  },
  {
    icon: Users,
    title: "Team Knowledge Base",
    description:
      "Build a shared knowledge base from your team's documents. Anyone can ask questions and get instant answers.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    accent: "#7c3aed",
    detail: "Shared workspace for teams",
  },
];

export const faqs = [
  {
    q: "What file types does Donna support?",
    a: "Donna supports PDF, Word (.doc, .docx), Excel (.xls, .xlsx), CSV, and plain text files. Upload any of these and start asking questions instantly.",
    icon: FileText,
  },
  {
    q: "How does the AI understand my documents?",
    a: "Donna uses advanced RAG (Retrieval-Augmented Generation) technology. Your documents are chunked, embedded using Hugging Face models, and stored in a vector database for semantic search.",
    icon: Brain,
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. Your documents and credentials are stored privately with Supabase. Only you can access your data   we never share or train on your files.",
    icon: Lock,
  },
  {
    q: "How does the Gmail integration work?",
    a: "You connect your Gmail using an App Password (not your real password). Donna can then read your inbox, summarize emails, and send messages through natural chat commands.",
    icon: Mail,
  },
  {
    q: "How fast are the AI responses?",
    a: "Donna is powered by Groq for blazing fast inference. Most responses arrive in under 3 seconds, even for complex document queries across multiple files.",
    icon: Zap,
  },
  {
    q: "Can I use Donna for free?",
    a: "Yes   Donna is free to use. Sign up, upload your documents, and start chatting with your AI workspace assistant right away.",
    icon: Sparkles,
  },
];

export const steps = [
  {
    num: "01",
    title: "Upload Your Files",
    description: "Drag and drop PDFs, Word docs, or spreadsheets into your workspace.",
    icon: Upload,
  },
  {
    num: "02",
    title: "Ask Anything",
    description: "Chat naturally   Donna searches your knowledge base and finds answers.",
    icon: MessageSquare,
  },
  {
    num: "03",
    title: "Take Action",
    description: "Send emails, get summaries, extract data, and automate your workflow.",
    icon: Zap,
  },
];

export const teamMembers = [
  {
    name: "Huzaif",
    role: "Full Stack Developer",
    bio: "Passionate about building seamless user experiences and scalable backend systems. Focused on AI integration and real-time features.",
    skills: ["React", "Next.js", "Node.js", "AI/ML"],
    gradient: "from-emerald-500 to-teal-500",
    initial: "Huz",
    github: "https://github.com/huzfm",
    linkedin: "https://linkedin.com/in/huzfm",
  },
  {
    name: "Faisal",
    role: "Full Stack Developer",
    bio: "Driven by clean architecture and performance optimization. Specializes in database design, API development, and cloud infrastructure.",
    skills: ["TypeScript", "Supabase", "Python", "DevOps"],
    gradient: "from-blue-500 to-indigo-500",
    initial: "Fab",
    github: "https://github.com/fab-c14",
    linkedin: "https://linkedin.com/in/fab-c14",
  },
];

export const techStack = [
  { name: "Groq", desc: "LLM inference", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  {
    name: "Hugging Face",
    desc: "Embeddings",
    icon: Brain,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "Supabase",
    desc: "Auth & database",
    icon: Lock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Next.js",
    desc: "App framework",
    icon: Globe,
    color: "text-slate-900",
    bg: "bg-slate-100",
  },
  {
    name: "TypeScript",
    desc: "Type safety",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Tailwind CSS",
    desc: "Styling",
    icon: Sparkles,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];
