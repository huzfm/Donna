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
  const [subject, setSubject] = useState("Project Update — Q1 Progress");
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
          className="absolute right-0 top-0 bottom-0 w-[400px] bg-white border-l border-border z-20 flex flex-col"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-primary">Compose Email</h2>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center text-secondary transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          </div>

          <motion.div
            className="flex-1 overflow-y-auto p-6 space-y-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">To</label>
              <div className="flex flex-wrap gap-1.5 p-2.5 border border-border rounded-lg bg-white min-h-[40px]">
                {recipients.map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-accent-light text-accent px-2.5 py-1 rounded-full text-xs font-medium"
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
                  className="outline-none flex-1 min-w-[100px] text-sm text-primary placeholder:text-muted"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="flex-1">
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-primary leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
              {["Improve tone", "Make shorter", "Add call to action"].map((suggestion) => (
                <button
                  key={suggestion}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-accent bg-accent-light hover:bg-accent-muted/30 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Sparkles size={12} />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          </motion.div>

          <div className="border-t border-border px-6 py-4 flex items-center gap-3">
            <Button className="flex-1">Send</Button>
            <Button variant="ghost">Save draft</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
