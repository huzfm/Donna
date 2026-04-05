"use client";

import { motion } from "framer-motion";
import { AlertCircle, LogOut } from "lucide-react";

export default function AccountPanel({
      email,
      createdAt,
      onLogout,
}: {
      email: string | null;
      createdAt: string | null;
      onLogout: () => void;
}) {
      return (
            <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 flex-col overflow-hidden bg-white"
            >
                  <div className="shrink-0 border-b border-neutral-200 px-6 py-3">
                        <h1 className="text-sm font-semibold text-neutral-900">Account</h1>
                        <p className="text-[11px] text-neutral-400">Manage your account details</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-lg">
                              <div className="mb-5 rounded-xl border border-neutral-200 p-6">
                                    <div className="mb-5 flex items-center gap-3.5">
                                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-xl font-bold text-white">
                                                {email?.[0]?.toUpperCase() ?? "?"}
                                          </div>
                                          <div className="min-w-0">
                                                <h3 className="truncate text-sm font-semibold text-neutral-900">
                                                      {email ?? " "}
                                                </h3>
                                                <p className="mt-0.5 text-xs text-neutral-400">
                                                      {createdAt
                                                            ? `Member since ${new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                                                            : ""}
                                                </p>
                                          </div>
                                    </div>
                                    <div className="space-y-2">
                                          {[
                                                { label: "Email Address", value: email ?? " " },
                                                {
                                                      label: "Authentication",
                                                      value: "Email / Password (Supabase)",
                                                },
                                                ...(createdAt
                                                      ? [
                                                              {
                                                                    label: "Account Created",
                                                                    value: new Date(
                                                                          createdAt
                                                                    ).toLocaleDateString("en-US", {
                                                                          weekday: "long",
                                                                          year: "numeric",
                                                                          month: "long",
                                                                          day: "numeric",
                                                                    }),
                                                              },
                                                        ]
                                                      : []),
                                          ].map((row) => (
                                                <div
                                                      key={row.label}
                                                      className="rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-2.5"
                                                >
                                                      <label className="mb-0.5 block text-[10px] tracking-wider text-neutral-400 uppercase">
                                                            {row.label}
                                                      </label>
                                                      <p className="text-sm text-neutral-800">
                                                            {row.value}
                                                      </p>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                              <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
                                    <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                                          <AlertCircle size={12} /> Danger Zone
                                    </h4>
                                    <p className="mb-3 text-xs text-neutral-500">
                                          Sign out of your current session on this device.
                                    </p>
                                    <button
                                          onClick={onLogout}
                                          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                                    >
                                          <LogOut size={12} /> Sign out
                                    </button>
                              </div>
                        </div>
                  </div>
            </motion.div>
      );
}
