"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import { teamMembers } from "./data";

export default function TeamSection() {
  return (
    <section id="team" className="bg-white px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block font-mono text-xs font-semibold tracking-widest text-slate-500 uppercase">
            The Team
          </span>
          <h2 className="mb-4 font-(family-name:--font-doto) text-3xl font-black tracking-tight text-black md:text-4xl">
            Meet the <span className="text-black">builders</span>
          </h2>
          <p className="mx-auto max-w-lg font-mono text-[15px] leading-relaxed text-slate-500">
            Two full-stack developers passionate about building AI-powered tools that make work
            easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-400"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-black" />

              <div className="mb-6 flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900">
                  <span className="font-(family-name:--font-doto) text-2xl font-black text-white">
                    {member.initial}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="font-(family-name:--font-doto) text-xl font-black tracking-tight text-black">
                    {member.name}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Code2 size={13} className="text-slate-400" />
                    <span className="font-mono text-sm font-medium text-slate-500">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mb-6 font-mono text-sm leading-relaxed text-slate-500">{member.bio}</p>

              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 px-3 py-1 font-mono text-[11px] font-semibold text-slate-500 transition-colors group-hover:border-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <a
                  href={member.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs font-medium text-slate-400 transition-all hover:border-slate-400 hover:text-slate-900"
                >
                  <Code2 size={12} /> GitHub
                </a>
                <a
                  href={member.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-mono text-xs font-medium text-slate-400 transition-all hover:border-slate-400 hover:text-slate-900"
                >
                  <ExternalLink size={12} /> LinkedIn
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
