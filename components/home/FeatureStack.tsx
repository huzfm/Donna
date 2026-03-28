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
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  const activeFeature = features[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      <div
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 min-h-[420px]"
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
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${activeFeature.accent}15` }}
            >
              <activeFeature.icon size={26} className={activeFeature.color} />
            </div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest mb-2 block font-(family-name:--font-doto)"
              style={{ color: activeFeature.accent }}
            >
              {activeFeature.tag}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight mb-4 font-(family-name:--font-doto)">
              {activeFeature.title}
            </h3>
            <p className="text-[15px] text-slate-500 leading-relaxed max-w-sm">
              {activeFeature.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-10 flex items-center gap-2">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                backgroundColor: i === active ? f.accent : "#cbd5e1",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-1.5 py-1 rounded-2xl border border-slate-200 px-2">
        {features.map((feature, i) => (
          <button
            key={feature.title}
            onClick={() => goTo(i)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`w-full text-left rounded-xl px-5 py-4 transition-all duration-300 border ${
              i === active
                ? "bg-white border-slate-300"
                : "bg-transparent border-transparent hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  i === active ? feature.bg : "bg-slate-100"
                }`}
              >
                <feature.icon
                  size={17}
                  className={`transition-colors duration-300 ${i === active ? feature.color : "text-slate-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-bold transition-colors duration-300 font-(family-name:--font-doto) block ${
                  i === active ? "text-slate-950" : "text-slate-700"
                }`}>
                  {feature.title}
                </span>
                {i === active && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-slate-400 mt-0.5 block leading-snug"
                  >
                    {feature.description.slice(0, 60)}...
                  </motion.span>
                )}
              </div>
              {i === active && (
                <div className="h-1.5 w-14 rounded-full bg-slate-200 overflow-hidden shrink-0">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: feature.accent }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: INTERVAL / 1000, ease: "linear" }}
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
