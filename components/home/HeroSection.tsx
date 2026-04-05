"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardDemo from "./DashboardDemo";

export default function HeroSection() {
      return (
            <section className="relative bg-white px-6 pt-32 pb-24 md:pt-40">
                  <div className="lightning-grid">
                        <div className="lightning-grid-lines" />
                        <div
                              className="lightning-pulse-h"
                              style={{ top: "25%", animationDelay: "0s" }}
                        />
                        <div
                              className="lightning-pulse-h"
                              style={{ top: "50%", animationDelay: "1.5s" }}
                        />
                        <div
                              className="lightning-pulse-h"
                              style={{ top: "75%", animationDelay: "2.8s" }}
                        />
                        <div
                              className="lightning-pulse-v"
                              style={{ left: "20%", animationDelay: "0.5s" }}
                        />
                        <div
                              className="lightning-pulse-v"
                              style={{ left: "50%", animationDelay: "2s" }}
                        />
                        <div
                              className="lightning-pulse-v"
                              style={{ left: "80%", animationDelay: "3.5s" }}
                        />
                        <div
                              className="lightning-flash"
                              style={{ top: "30%", left: "25%", animationDelay: "0s" }}
                        />
                        <div
                              className="lightning-flash"
                              style={{ top: "60%", left: "70%", animationDelay: "1.5s" }}
                        />
                        <div
                              className="lightning-flash"
                              style={{ top: "20%", left: "60%", animationDelay: "2.5s" }}
                        />
                  </div>

                  <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        <div>
                              <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 flex justify-start"
                              >
                                    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs text-gray-500 shadow-sm">
                                          <span className="text-gray-400">Built with</span>
                                          <span className="font-mono font-semibold text-orange-500">
                                                Groq
                                          </span>
                                          <span className="text-gray-300">+</span>
                                          <span className="font-mono font-semibold text-yellow-400">
                                                Hugging Face
                                          </span>
                                    </div>
                              </motion.div>

                              <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="mb-6 font-(family-name:--font-doto) text-5xl leading-[1.08] font-black tracking-tight text-slate-950 md:text-6xl lg:text-[4.1rem]"
                              >
                                    Your Personal
                                    <br />
                                    <span className="font-black text-black">AI Assistant</span>
                              </motion.h1>

                              <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="mb-9 max-w-md font-mono text-[15px] leading-relaxed text-slate-600 md:text-base"
                              >
                                    Upload documents, ask questions, manage emails all in one
                                    intelligent workspace. Donna understands your files and helps
                                    you work smarter.
                              </motion.p>

                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="flex flex-col gap-3 sm:flex-row"
                              >
                                    <Link
                                          href="/signup"
                                          className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-mono text-sm font-semibold text-white transition-all hover:bg-transparent hover:text-slate-900 hover:ring-2 hover:ring-slate-900"
                                    >
                                          Get Started
                                          <ArrowRight
                                                size={15}
                                                className="transition-transform group-hover:translate-x-1"
                                          />
                                    </Link>
                              </motion.div>
                        </div>

                        <motion.div
                              initial={{ opacity: 0, y: 30, rotate: 1 }}
                              animate={{ opacity: 1, y: 0, rotate: 0 }}
                              transition={{ duration: 0.9, delay: 0.3 }}
                        >
                              <DashboardDemo />
                        </motion.div>
                  </div>
            </section>
      );
}
