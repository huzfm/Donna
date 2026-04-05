"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { features } from "./data";

const INTERVAL = 3500;

export default function FeatureStack() {
      const [active, setActive] = useState(0);
      const [direction, setDirection] = useState(1);
      const [paused, setPaused] = useState(false);
      const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

      useEffect(() => {
            if (paused) return;
            intervalRef.current = setInterval(() => {
                  setDirection(1);
                  setActive((prev) => (prev + 1) % features.length);
            }, INTERVAL);
            return () => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
            };
      }, [paused]);

      const goTo = (i: number) => {
            setDirection(i > active ? 1 : -1);
            setActive(i);
      };

      const slideVariants = {
            enter: (dir: number) => ({
                  x: dir > 0 ? 300 : -300,
                  opacity: 0,
                  scale: 0.92,
            }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (dir: number) => ({
                  x: dir > 0 ? -300 : 300,
                  opacity: 0,
                  scale: 0.92,
            }),
      };

      const activeFeature = features[active];

      return (
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
                  {/* LEFT GLASS CARD */}
                  <div
                        className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-b from-white/80 via-white/60 to-white/30 font-mono shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/10 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/70 before:to-transparent before:opacity-60 after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-white/40"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                  >
                        <AnimatePresence mode="wait" custom={direction}>
                              <motion.div
                                    key={active}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="absolute inset-0 flex flex-col justify-center p-10"
                              >
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/40 backdrop-blur-sm">
                                          <activeFeature.icon size={26} className="text-black" />
                                    </div>

                                    {/* TAG */}
                                    <span className="mb-2 block text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                                          {activeFeature.tag}
                                    </span>

                                    {/* TITLE */}
                                    <h3 className="mb-4 font-(family-name:--font-doto) text-2xl font-extrabold tracking-tight text-black">
                                          {activeFeature.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    <p className="max-w-sm text-[15px] leading-relaxed text-slate-500">
                                          {activeFeature.description}
                                    </p>
                              </motion.div>
                        </AnimatePresence>

                        {/* Indicators */}
                        <div className="absolute bottom-5 left-10 flex items-center gap-2">
                              {features.map((_, i) => (
                                    <button
                                          key={i}
                                          onClick={() => goTo(i)}
                                          className="relative h-1.5 rounded-full transition-all duration-300"
                                          style={{
                                                width: i === active ? 28 : 8,
                                                backgroundColor: i === active ? "#000" : "#cbd5e1",
                                          }}
                                    />
                              ))}
                        </div>
                  </div>

                  {/* RIGHT GLASS PANEL */}
                  <div className="flex flex-col justify-between gap-1.5 rounded-2xl border border-white/50 bg-gradient-to-b from-white/70 to-white/40 px-2 py-1 font-mono shadow-[0_6px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/10 backdrop-blur-xl">
                        {features.map((feature, i) => (
                              <button
                                    key={feature.title}
                                    onClick={() => goTo(i)}
                                    onMouseEnter={() => setPaused(true)}
                                    onMouseLeave={() => setPaused(false)}
                                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                                          i === active
                                                ? "border-white/60 bg-white/60 shadow-sm backdrop-blur-md"
                                                : "border-transparent bg-transparent hover:bg-white/40"
                                    }`}
                              >
                                    <div className="flex items-center gap-3">
                                          {/* ICON */}
                                          <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                      i === active ? "bg-white/70" : "bg-white/40"
                                                }`}
                                          >
                                                <feature.icon
                                                      size={17}
                                                      className={`text-black transition-all duration-300 ${
                                                            i === active
                                                                  ? "scale-105 opacity-100"
                                                                  : "opacity-70"
                                                      }`}
                                                />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                                {/* TITLE */}
                                                <span
                                                      className={`block font-(family-name:--font-doto) text-sm font-bold tracking-tight ${
                                                            i === active
                                                                  ? "text-black"
                                                                  : "text-slate-700"
                                                      }`}
                                                >
                                                      {feature.title}
                                                </span>

                                                {/* DESCRIPTION */}
                                                {i === active && (
                                                      <motion.span
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            className="mt-0.5 block text-xs leading-snug text-slate-500"
                                                      >
                                                            {feature.description.slice(0, 60)}...
                                                      </motion.span>
                                                )}
                                          </div>

                                          {/* PROGRESS */}
                                          {i === active && (
                                                <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-slate-200/60">
                                                      <motion.div
                                                            className="h-full rounded-full bg-black"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: "100%" }}
                                                            transition={{
                                                                  duration: INTERVAL / 1000,
                                                                  ease: "linear",
                                                            }}
                                                            key={active}
                                                      />
                                                </div>
                                          )}
                                    </div>
                              </button>
                        ))}
                  </div>
            </div>
      );
}
