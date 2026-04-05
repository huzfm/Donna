"use client";

import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
      open: boolean;
      upgrading: boolean;
      onClose: () => void;
      onUpgrade: () => void;
}

export default function UpgradeModal({ open, upgrading, onClose, onUpgrade }: UpgradeModalProps) {
      return (
            <AnimatePresence>
                  {open && (
                        <>
                              <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={onClose}
                                    className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
                              />
                              <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
                                    <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: 16 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: 16 }}
                                          transition={{ duration: 0.2 }}
                                          className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                                    >
                                          <div className="bg-slate-900 px-6 pt-6 pb-5 text-white">
                                                <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                                      Donna Pro
                                                </p>
                                                <h2 className="font-(family-name:--font-doto) text-2xl font-black tracking-tight">
                                                      Unlock unlimited access
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-300">
                                                      You&apos;ve used your free prompts. Upgrade to
                                                      keep going.
                                                </p>
                                          </div>

                                          <div className="space-y-3 px-6 py-5">
                                                {[
                                                      { text: "Unlimited AI prompts" },
                                                      { text: "Unlimited file uploads" },
                                                      { text: "Email send & read" },
                                                      { text: "Diagrams from your data" },
                                                ].map((f) => (
                                                      <div
                                                            key={f.text}
                                                            className="flex items-center gap-3 text-sm text-slate-700"
                                                      >
                                                            {f.text}
                                                      </div>
                                                ))}
                                          </div>

                                          <div className="border-t border-slate-100 px-6 pb-6">
                                                <div className="mb-4 flex items-baseline gap-1 pt-4">
                                                      <span className="font-(family-name:--font-doto) text-3xl font-black text-slate-900">
                                                            ₹299
                                                      </span>
                                                      <span className="text-sm text-slate-500">
                                                            / month
                                                      </span>
                                                </div>
                                                <button
                                                      onClick={onUpgrade}
                                                      disabled={upgrading}
                                                      className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700 disabled:opacity-50"
                                                >
                                                      {upgrading
                                                            ? "Redirecting…"
                                                            : "Upgrade to Pro →"}
                                                </button>
                                                <button
                                                      onClick={onClose}
                                                      className="mt-2 w-full py-2 text-xs text-slate-400 hover:text-slate-600"
                                                >
                                                      Maybe later
                                                </button>
                                          </div>
                                    </motion.div>
                              </div>
                        </>
                  )}
            </AnimatePresence>
      );
}
