import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
  isSameMonth,
  isToday,
  isFuture,
} from "date-fns";
import { getAllEntries, DayEntry } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const entries = useMemo(() => {
    const all = getAllEntries();
    return new Map(all.map((e) => [e.date, e.saved]));
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const savedCount = days.filter((d) => entries.get(format(d, "yyyy-MM-dd")) === true).length;
  const missedCount = days.filter((d) => entries.get(format(d, "yyyy-MM-dd")) === false).length;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg bg-secondary text-foreground">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-display font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg bg-secondary text-foreground">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-success" /> {savedCount} saved
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="w-3 h-3 rounded-full bg-danger" /> {missedCount} missed
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-body text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid grid-cols-7 gap-1"
        >
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const saved = entries.get(key);
            const future = isFuture(day);
            const today = isToday(day);

            let bg = "bg-secondary/30";
            if (saved === true) bg = "bg-success/80";
            else if (saved === false) bg = "bg-danger/60";

            return (
              <div
                key={key}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-body transition-colors ${bg} ${
                  today ? "ring-2 ring-primary" : ""
                } ${future ? "opacity-30" : ""}`}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
