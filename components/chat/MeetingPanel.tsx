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
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
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
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          className="hover:bg-surface-2 text-secondary flex h-7 w-7 items-center justify-center rounded-md"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-primary text-sm font-medium">{monthName}</span>
        <button
          onClick={() => setMonth(new Date(year, m + 1, 1))}
          className="hover:bg-surface-2 text-secondary flex h-7 w-7 items-center justify-center rounded-md"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-muted py-1 text-xs">
            {d}
          </div>
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
              className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
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
  const [title, setTitle] = useState("Team Sync   Weekly Check-in");
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
          className="border-border absolute top-0 right-0 bottom-0 z-20 flex w-[400px] flex-col border-l bg-white"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="border-border flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-primary text-base font-semibold">Schedule Meeting</h2>
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
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border text-primary focus:ring-accent/20 focus:border-accent w-full rounded-lg border px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Date
              </label>
              <MiniCalendar selected={selectedDay} onSelect={setSelectedDay} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Time
              </label>
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
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                      selectedTime === slot
                        ? "bg-accent text-white"
                        : "border-border text-secondary hover:bg-accent-light hover:text-accent border"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slot}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Duration
              </label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDuration(d)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      selectedDuration === d
                        ? "bg-accent text-white"
                        : "border-border text-secondary hover:bg-accent-light border"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Attendees
              </label>
              <div className="border-border flex min-h-[40px] flex-wrap gap-1.5 rounded-lg border bg-white p-2.5">
                {attendees.map((a, i) => (
                  <span
                    key={i}
                    className="bg-accent-light text-accent inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
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
                  className="text-primary placeholder:text-muted min-w-[100px] flex-1 text-sm outline-none"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <label className="text-muted mb-2 block text-xs font-medium tracking-wider uppercase">
                Meeting Link
              </label>
              <div className="border-border bg-surface text-secondary flex items-center gap-2 rounded-lg border p-2.5 text-sm">
                <LinkIcon size={14} className="text-muted shrink-0" />
                <span className="truncate">meet.donna.ai/j/abc-def-ghi</span>
                <button className="text-accent hover:text-accent-hover ml-auto shrink-0">
                  <Copy size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>

          <div className="border-border flex items-center gap-3 border-t px-6 py-4">
            <Button className="flex-1">Send invite</Button>
            <Button variant="ghost">Copy link</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
