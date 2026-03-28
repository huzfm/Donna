"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import { teamMembers } from "./data";

export default function TeamSection() {
  return (
    <section id="team" className="py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3 block">The Team</span>
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-slate-950 font-(family-name:--font-doto)">
            Meet the{" "}
            <span className="text-emerald-600">builders</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            Two full-stack developers passionate about building AI-powered tools that make work easier.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group rounded-2xl border border-slate-200 bg-white p-8 hover:border-slate-400 transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${member.gradient}`} />

              <div className="flex items-start gap-5 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.gradient} flex items-center justify-center shrink-0`}>
                  <span className="text-2xl font-black text-white font-(family-name:--font-doto)">{member.initial}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-black text-slate-950 tracking-tight font-(family-name:--font-doto)">{member.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Code2 size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">{member.role}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed mb-6">{member.bio}</p>

              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span key={skill} className="text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-200 text-slate-500 group-hover:border-slate-300 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:text-slate-900 hover:border-slate-400 transition-all">
                  <Code2 size={12} /> GitHub
                </a>
                <a href="#" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 hover:text-slate-900 hover:border-slate-400 transition-all">
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
