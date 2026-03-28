"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Link as LinkIcon, Copy } from "lucide-react";
import { useState } from "react";
import { slideInRight, staggerContainer, staggerItem } from "@/lib/animations";
import Button from "@/components/ui/Button";

interface MeetingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM",
];

const durations = ["30 min", "1 hour", "1.5 hours"];

function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (day: number) => void;
}) {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const today = new Date();

  const monthName = month.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          className="w-7 h-7 rounded-md hover:bg-surface-2 flex items-center justify-center text-secondary"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-primary">{monthName}</span>
        <button
          onClick={() => setMonth(new Date(year, m + 1, 1))}
          className="w-7 h-7 rounded-md hover:bg-surface-2 flex items-center justify-center text-secondary"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-xs text-muted py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const isToday =
            day === today.getDate() && m === today.getMonth() && year === today.getFullYear();
          const isSelected = day === selected;
          return (
            <motion.button
              key={day}
              onClick={() => onSelect(day)}
              className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-accent text-white"
                  : isToday
                    ? "bg-accent-light text-accent"
                    : "text-primary hover:bg-surface-2"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function MeetingPanel({ isOpen, onClose }: MeetingPanelProps) {
  const [title, setTitle] = useState("Team Sync — Weekly Check-in");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 AM");
  const [selectedDuration, setSelectedDuration] = useState("30 min");
  const [attendees, setAttendees] = useState<string[]>(["sarah@company.com"]);
  const [attendeeInput, setAttendeeInput] = useState("");

  const addAttendee = () => {
    if (attendeeInput.trim() && attendeeInput.includes("@")) {
      setAttendees([...attendees, attendeeInput.trim()]);
      setAttendeeInput("");
    }
  };

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
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
            <h2 className="text-base font-semibold text-primary">Schedule Meeting</h2>
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
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Date</label>
              <MiniCalendar selected={selectedDay} onSelect={setSelectedDay} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Time</label>
              <motion.div
                className="grid grid-cols-4 gap-1.5"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {timeSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    variants={staggerItem}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      selectedTime === slot
                        ? "bg-accent text-white"
                        : "border border-border text-secondary hover:bg-accent-light hover:text-accent"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slot}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Duration</label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedDuration === d
                        ? "bg-accent text-white"
                        : "border border-border text-secondary hover:bg-accent-light"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Attendees</label>
              <div className="flex flex-wrap gap-1.5 p-2.5 border border-border rounded-lg bg-white min-h-[40px]">
                {attendees.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-accent-light text-accent px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {a}
                    <button onClick={() => removeAttendee(i)} className="hover:text-accent-hover">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addAttendee();
                    }
                  }}
                  placeholder="Add attendee..."
                  className="outline-none flex-1 min-w-[100px] text-sm text-primary placeholder:text-muted"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">Meeting Link</label>
              <div className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-surface text-sm text-secondary">
                <LinkIcon size={14} className="text-muted shrink-0" />
                <span className="truncate">meet.donna.ai/j/abc-def-ghi</span>
                <button className="ml-auto text-accent hover:text-accent-hover shrink-0">
                  <Copy size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>

          <div className="border-t border-border px-6 py-4 flex items-center gap-3">
            <Button className="flex-1">Send invite</Button>
            <Button variant="ghost">Copy link</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
