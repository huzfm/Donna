"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import SignupForm from "@/components/auth/SignupForm";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function SignUpPage() {
      const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);
      const [successAnimation, setSuccessAnimation] = useState<Record<string, unknown> | null>(
            null
      );

      useEffect(() => {
            fetch("/animations/chatbot.json")
                  .then((r) => r.json())
                  .then(setAnimationData)
                  .catch(() => {});
            fetch("/animations/email-sent.json")
                  .then((r) => r.json())
                  .then(setSuccessAnimation)
                  .catch(() => {});
      }, []);

      return (
            <div className="relative min-h-screen overflow-hidden bg-white">
                  <div className="relative z-10 flex min-h-screen">
                        {/* Left panel with Lottie animation */}
                        <div className="relative hidden flex-col items-center justify-center border-r border-slate-200 bg-slate-50 p-12 lg:flex lg:w-1/2">
                              <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7 }}
                                    className="w-full max-w-md"
                              >
                                    {animationData && (
                                          <Lottie
                                                animationData={animationData}
                                                loop
                                                autoplay
                                                className="w-full"
                                          />
                                    )}
                              </motion.div>
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="mt-8 text-center"
                              >
                                    <h2 className="mb-2 font-(family-name:--font-doto) text-2xl font-black tracking-tight text-slate-950">
                                          Start with <span className="text-emerald-600">Donna</span>
                                    </h2>
                                    <p className="mx-auto max-w-xs text-sm text-slate-500">
                                          Create your free account and unlock AI-powered document
                                          intelligence.
                                    </p>
                              </motion.div>
                              <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute bottom-8 text-xs text-slate-400"
                              >
                                    &copy; {new Date().getFullYear()} Donna. All rights reserved.
                              </motion.p>
                        </div>

                        {/* Right panel with form */}
                        <div className="flex flex-1 items-center justify-center p-6 md:p-12">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                              >
                                    <SignupForm
                                          animationData={animationData}
                                          successAnimation={successAnimation}
                                    />
                              </motion.div>
                        </div>
                  </div>
            </div>
      );
}
