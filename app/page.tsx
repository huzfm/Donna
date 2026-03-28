"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Chat",
    description:
      "Ask questions about your documents, get summaries, and extract insights using advanced RAG technology.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "Upload PDFs, Word docs, Excel files, and more. Donna indexes and understands your content instantly.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Mail,
    title: "Email Integration",
    description:
      "Read your Gmail inbox, draft responses, and send emails — all through natural conversation.",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your documents and credentials are stored securely. Only you can access your data.",
    gradient: "from-violet-500/20 to-violet-500/5",
  },
];

const steps = [
  { num: "01", title: "Upload Your Files", description: "Drag and drop PDFs, Word docs, or spreadsheets." },
  { num: "02", title: "Ask Anything", description: "Chat naturally — Donna searches your knowledge base." },
  { num: "03", title: "Take Action", description: "Send emails, get summaries, and automate tasks." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Navbar */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Brain size={18} className="text-emerald-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Donna</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/7 rounded-full blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />
          <div className="absolute top-60 right-1/4 w-[300px] h-[300px] bg-orange-500/4 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 mb-8"
          >
            <Sparkles size={12} className="text-emerald-400" />
            Powered by Groq &amp; Hugging Face
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your AI-Powered
            <br />
            <span className="bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Workspace Brain
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload documents, ask questions, manage emails — all in one intelligent workspace.
            Donna understands your files and helps you work smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              Start for free
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-medium transition-all"
            >
              Sign in to your account
            </Link>
          </motion.div>
        </div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-5xl mx-auto mt-20"
        >
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-1 shadow-2xl shadow-black/40">
            <div className="rounded-xl bg-slate-950 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="text-xs text-slate-500 bg-slate-800/50 px-4 py-1 rounded-md">
                    donna.ai/dashboard
                  </div>
                </div>
              </div>
              <div className="flex h-[340px]">
                <div className="w-64 border-r border-slate-800 p-4 hidden md:block">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-emerald-500/15 flex items-center justify-center">
                      <Brain size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-300">Donna</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                      <MessageSquare size={14} />
                      Chat
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-500 text-xs">
                      <FileText size={14} />
                      Files
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-slate-500 text-xs">
                      <Mail size={14} />
                      Gmail
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                        Summarize my project report
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-slate-800 text-slate-200 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-sm">
                        Based on your project report, here are the key highlights: Q1 revenue grew 23%...
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs">
                        Send this summary to my team
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3">
                    <span className="text-sm text-slate-500 flex-1">Ask Donna anything...</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                      <Zap size={14} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need in{" "}
              <span className="text-emerald-400">one workspace</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Donna brings together document intelligence, email management, and AI chat
              into a seamless experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 hover:border-slate-700 transition-all"
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-5 group-hover:bg-emerald-500/10 transition-colors">
                    <feature.icon size={22} className="text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started in{" "}
              <span className="text-emerald-400">three steps</span>
            </h2>
            <p className="text-slate-400">No complex setup — just sign up and start working smarter.</p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-start gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-800/50 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all">
                  <span className="text-sm font-bold text-emerald-400">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-orange-500/5 pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to work smarter?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Join Donna and let AI handle the heavy lifting — from document analysis to email management.
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
              >
                Create free account
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-emerald-400" />
            <span className="text-sm font-medium">Donna</span>
          </div>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Donna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
