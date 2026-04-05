"use client";

import { useState, useEffect, useRef } from "react";

const COUNT = 100;
const ATTRACT_RADIUS = 200;
const ATTRACT_FORCE = 1.2;
const SPRING = 0.045;
const DAMPING = 0.84;
const MAX_DISPLACEMENT = 35;
const LINE_RADIUS = 160;

interface ParticleState {
      vx: number;
      vy: number;
      ox: number;
      oy: number;
      cx: number;
      cy: number;
      floatPhase: number;
      floatSpeed: number;
      floatAmp: number;
}

export default function TerminalField() {
      const containerRef = useRef<HTMLDivElement>(null);
      const mouseRef = useRef({ x: -9999, y: -9999 });
      const smoothMouseRef = useRef({ x: -9999, y: -9999 });
      const glowRef = useRef<HTMLDivElement>(null);
      const svgRef = useRef<SVGSVGElement>(null);
      const rafRef = useRef<number>(0);
      const stateRef = useRef<ParticleState[]>([]);
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
            const colors = [
                  "#059669",
                  "#0d9488",
                  "#0891b2",
                  "#4f46e5",
                  "#7c3aed",
                  "#059669",
                  "#0d9488",
                  "#0891b2",
                  "#0f172a",
                  "#7c3aed",
            ];
            return Array.from({ length: COUNT }, (_, i) => {
                  const col = Math.floor(i / 10);
                  const row = i % 10;
                  return {
                        x: ((col * 10 + (row % 2) * 5 + ((i * 7 + 3) % 11) * 0.4) % 98) + 1,
                        y: ((row * 10 + ((i * 13 + 5) % 9) * 0.8) % 96) + 2,
                        glyph: glyphs[i % glyphs.length],
                        color: colors[i % colors.length],
                        fontSize: 10 + (i % 5) * 1.5,
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
                  stateRef.current = particles.map((p, i) => ({
                        vx: 0,
                        vy: 0,
                        ox: p.x,
                        oy: p.y,
                        cx: 0,
                        cy: 0,
                        floatPhase: (i * 2.39) % (Math.PI * 2),
                        floatSpeed: 0.008 + (i % 7) * 0.003,
                        floatAmp: 1.5 + (i % 5) * 0.6,
                  }));
                  initRef.current = true;
            }

            const tick = () => {
                  const mx = mouseRef.current.x;
                  const my = mouseRef.current.y;
                  const box = containerRef.current;

                  const sm = smoothMouseRef.current;
                  if (mx > -9000) {
                        sm.x += (mx - sm.x) * 0.12;
                        sm.y += (my - sm.y) * 0.12;
                  } else {
                        sm.x = -9999;
                        sm.y = -9999;
                  }

                  if (glowRef.current) {
                        if (sm.x > -9000) {
                              glowRef.current.style.opacity = "1";
                              glowRef.current.style.transform = `translate(${sm.x - 160}px, ${sm.y - 160}px)`;
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

                  const activePositions: {
                        x: number;
                        y: number;
                        color: string;
                        proximity: number;
                  }[] = [];

                  stateRef.current.forEach((s, i) => {
                        const el = elRefs.current[i];
                        if (!el) return;

                        s.floatPhase += s.floatSpeed;
                        const floatX = Math.sin(s.floatPhase) * s.floatAmp;
                        const floatY = Math.cos(s.floatPhase * 0.7 + 1.2) * s.floatAmp * 0.6;

                        const px = (s.ox / 100) * cw + s.cx;
                        const py = (s.oy / 100) * ch + s.cy;
                        const dx = sm.x - px;
                        const dy = sm.y - py;
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
                        const scale = 1 + proximity * 0.5;
                        const opacity = proximity * 0.6;
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        const rotate = proximity * angle * 0.05;

                        el.style.transform = `translate(${s.cx + floatX}px, ${s.cy + floatY}px) scale(${scale}) rotate(${rotate}deg)`;
                        el.style.opacity = `${Math.min(opacity, 1)}`;

                        if (proximity > 0.2) {
                              el.style.textShadow = `0 0 ${proximity * 16}px ${particles[i].color}`;
                              el.style.color = particles[i].color;
                              activePositions.push({
                                    x: px + s.cx,
                                    y: py + s.cy,
                                    color: particles[i].color,
                                    proximity,
                              });
                        } else {
                              el.style.textShadow = "none";
                        }
                  });

                  if (svgRef.current) {
                        let lines = "";
                        for (let a = 0; a < activePositions.length; a++) {
                              for (let b = a + 1; b < activePositions.length; b++) {
                                    const pa = activePositions[a];
                                    const pb = activePositions[b];
                                    const ddx = pa.x - pb.x;
                                    const ddy = pa.y - pb.y;
                                    const dd = Math.sqrt(ddx * ddx + ddy * ddy);
                                    if (dd < LINE_RADIUS) {
                                          const lineOpacity =
                                                (1 - dd / LINE_RADIUS) *
                                                Math.min(pa.proximity, pb.proximity) *
                                                0.35;
                                          lines += `<line x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" stroke="${pa.color}" stroke-opacity="${lineOpacity}" stroke-width="0.8"/>`;
                                    }
                              }
                        }
                        svgRef.current.innerHTML = lines;
                  }

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
            <div
                  ref={containerRef}
                  className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
            >
                  {/* Ambient glow */}
                  <div
                        ref={glowRef}
                        className="absolute h-[320px] w-[320px] rounded-full opacity-0"
                        style={{
                              background:
                                    "radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 35%, transparent 65%)",
                              transition: "opacity 0.4s ease",
                        }}
                  />

                  {/* Connection lines */}
                  <svg ref={svgRef} className="absolute inset-0 h-full w-full" />

                  {/* Glyphs */}
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
