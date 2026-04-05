"use client";

import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const LazyPieChart = lazy(() => import("recharts").then((m) => ({ default: m.PieChart })));
const LazyPie = lazy(() => import("recharts").then((m) => ({ default: m.Pie })));

export const PIE_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#94a3b8"];

function PieChartInner({ pieData }: { pieData: { name: string; value: number }[] }) {
      const { ResponsiveContainer, Tooltip, Cell } = require("recharts");
      return (
            <>
                  <div className="mx-auto h-[140px] w-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                              <LazyPieChart>
                                    <LazyPie
                                          data={pieData}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={36}
                                          outerRadius={58}
                                          paddingAngle={3}
                                          dataKey="value"
                                          strokeWidth={0}
                                    >
                                          {pieData.map((_: unknown, i: number) => (
                                                <Cell
                                                      key={i}
                                                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                                                />
                                          ))}
                                    </LazyPie>
                                    <Tooltip
                                          contentStyle={{
                                                borderRadius: "12px",
                                                border: "1px solid #e2e8f0",
                                                fontSize: "12px",
                                                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                                          }}
                                    />
                              </LazyPieChart>
                        </ResponsiveContainer>
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                        {pieData.map((d: { name: string; value: number }, i: number) => (
                              <span
                                    key={d.name}
                                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700"
                              >
                                    <span
                                          className="inline-block h-2.5 w-2.5 rounded-full"
                                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                                    />
                                    {d.name} · {d.value}
                              </span>
                        ))}
                  </div>
            </>
      );
}

export default function FilePieChart({ pieData }: { pieData: { name: string; value: number }[] }) {
      return (
            <Suspense
                  fallback={
                        <div className="flex h-[140px] items-center justify-center">
                              <Loader2 size={20} className="animate-spin text-slate-400" />
                        </div>
                  }
            >
                  <PieChartInner pieData={pieData} />
            </Suspense>
      );
}
