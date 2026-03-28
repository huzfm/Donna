"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useState } from "react";
import { slideInRight, staggerContainer, staggerItem } from "@/lib/animations";
import Button from "@/components/ui/Button";

interface EmailPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailPanel({ isOpen, onClose }: EmailPanelProps) {
  const [recipients, setRecipients] = useState<string[]>(["sarah@company.com"]);
  const [recipientInput, setRecipientInput] = useState("");
  const [subject, setSubject] = useState("Project Update   Q1 Progress");
  const [body, setBody] = useState(
    "Hi Sarah,\n\nI wanted to follow up on the project milestones we discussed. Here's a quick summary of our Q1 progress...\n\nLooking forward to your feedback.\n\nBest regards"
  );

  const addRecipient = () => {
    if (recipientInput.trim() && recipientInput.includes("@")) {
      setRecipients([...recipients, recipientInput.trim()]);
      setRecipientInput("");
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="border-border absolute top-0 right-0 bottom-0 z-20 flex w-[400px] flex-col border-l bg-white"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-primary text-base font-semibold">Compose Email</h2>
            <motion.button
              onClick={onClose}
              className="hover:bg-surface-2 text-secondary flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </div>

          <motion.div
            className="flex-1 space-y-5 overflow-y-auto p-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                To
              </label>
              <div className="border-border flex min-h-[40px] flex-wrap gap-1.5 rounded-lg border bg-white p-2.5">
                {recipients.map((r, i) => (
                  <span
                    key={i}
                    className="bg-accent-light text-accent inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {r}
                    <button onClick={() => removeRecipient(i)} className="hover:text-accent-hover">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addRecipient();
                    }
                  }}
                  placeholder="Add recipient..."
                  className="text-primary placeholder:text-muted min-w-[100px] flex-1 text-sm outline-none"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-border text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="flex-1">
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="border-border text-primary focus:ring-accent/20 focus:border-accent w-full resize-y rounded-lg border px-3 py-2.5 text-sm leading-relaxed focus:ring-2 focus:outline-none"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
              {["Improve tone", "Make shorter", "Add call to action"].map((suggestion) => (
                <button
                  key={suggestion}
                  className="text-accent bg-accent-light hover:bg-accent-muted/30 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  <Sparkles size={12} />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          </motion.div>

          <div className="border-border flex items-center gap-3 border-t px-6 py-4">
            <Button className="flex-1">Send</Button>
            <Button variant="ghost">Save draft</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
