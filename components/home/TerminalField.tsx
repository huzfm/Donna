"use client";

import { useState, useEffect, useRef } from "react";

const COUNT = 90;
const ATTRACT_RADIUS = 180;
const ATTRACT_FORCE = 0.8;
const SPRING = 0.06;
const DAMPING = 0.82;
const MAX_DISPLACEMENT = 25;

export default function TerminalField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef<
    { vx: number; vy: number; ox: number; oy: number; cx: number; cy: number }[]
  >([]);

  const [particles] = useState(() => {
    const glyphs = [
      ">_",
      "~/",
      "./",
      "$",
      "#",
      ">>",
      "|",
      "&&",
      "=>",
      "//",
      "{}",
      "[]",
      "()",
      "</>",
      "fn",
      "::",
      "++",
      "!=",
      "===",
      "**",
      "0x",
      "...",
      ";",
      "/*",
      "*/",
      "->",
      "<<",
      "let",
      "if",
      ">>>",
    ];
    const colors = ["#059669", "#0d9488", "#0891b2", "#4f46e5", "#7c3aed", "#0f172a"];
    return Array.from({ length: COUNT }, (_, i) => {
      const col = Math.floor(i / 10);
      const row = i % 10;
      return {
        x: ((col * 11.1 + (row % 2) * 5.5 + ((i * 7 + 3) % 11) * 0.45) % 98) + 1,
        y: ((row * 10 + ((i * 13 + 5) % 9) * 0.9) % 96) + 2,
        glyph: glyphs[i % glyphs.length],
        color: colors[i % colors.length],
        fontSize: 10 + (i % 4) * 2,
      };
    });
  });

  const elRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    if (!initRef.current) {
      stateRef.current = particles.map((p) => ({ vx: 0, vy: 0, ox: p.x, oy: p.y, cx: 0, cy: 0 }));
      initRef.current = true;
    }

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const box = containerRef.current;

      if (glowRef.current) {
        if (mx > -9000) {
          glowRef.current.style.opacity = "1";
          glowRef.current.style.transform = `translate(${mx - 140}px, ${my - 140}px)`;
        } else {
          glowRef.current.style.opacity = "0";
        }
      }

      if (!box) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const cw = box.offsetWidth;
      const ch = box.offsetHeight;

      stateRef.current.forEach((s, i) => {
        const el = elRefs.current[i];
        if (!el) return;

        const px = (s.ox / 100) * cw + s.cx;
        const py = (s.oy / 100) * ch + s.cy;
        const dx = mx - px;
        const dy = my - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ATTRACT_RADIUS && dist > 1) {
          const t = 1 - dist / ATTRACT_RADIUS;
          const force = t * t * ATTRACT_FORCE;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }

        s.vx = (s.vx + -s.cx * SPRING) * DAMPING;
        s.vy = (s.vy + -s.cy * SPRING) * DAMPING;
        s.cx += s.vx;
        s.cy += s.vy;

        const disp = Math.sqrt(s.cx * s.cx + s.cy * s.cy);
        if (disp > MAX_DISPLACEMENT) {
          const ratio = MAX_DISPLACEMENT / disp;
          s.cx *= ratio;
          s.cy *= ratio;
          s.vx *= 0.5;
          s.vy *= 0.5;
        }

        const proximity = dist < ATTRACT_RADIUS ? 1 - dist / ATTRACT_RADIUS : 0;
        const scale = 1 + proximity * 0.3;
        const opacity = proximity * 0.35;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const rotateAmount = proximity * 15;

        el.style.transform = `translate(${s.cx}px, ${s.cy}px) scale(${scale}) rotate(${rotateAmount > 0 ? angle * 0.1 : 0}deg)`;
        el.style.opacity = `${Math.min(opacity, 1)}`;
        el.style.textShadow =
          proximity > 0.3 ? `0 0 ${proximity * 12}px ${particles[i].color}` : "none";
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [particles]);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute h-[280px] w-[280px] rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)",
        }}
      />
      {particles.map((p, i) => (
        <span
          key={i}
          ref={(el) => {
            elRefs.current[i] = el;
          }}
          className="absolute font-mono font-bold will-change-transform select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.fontSize,
            color: p.color,
            opacity: 0,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
