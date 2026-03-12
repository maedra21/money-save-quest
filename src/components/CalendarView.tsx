import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  subMonths,
  addMonths,
  isToday,
  isFuture,
} from "date-fns";
import { getAllEntries, DayEntry, getEntryItems } from "@/lib/storage";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { t, formatCurrency, getPreferences } from "@/lib/i18n";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ date: string; entry?: DayEntry } | null>(null);
  const lang = getPreferences().language;

  const entries = useMemo(() => {
    const all = getAllEntries();
    return new Map(all.map((e) => [e.date, e]));
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const savedCount = days.filter((d) => entries.get(format(d, "yyyy-MM-dd"))?.saved === true).length;
  const missedCount = days.filter((d) => entries.get(format(d, "yyyy-MM-dd"))?.saved === false).length;
  const totalAmount = days
    .filter((d) => entries.get(format(d, "yyyy-MM-dd"))?.saved)
    .reduce((sum, d) => sum + (entries.get(format(d, "yyyy-MM-dd"))?.amount || 0), 0);

  const handleDayClick = (day: Date) => {
    if (isFuture(day)) return;
    const key = format(day, "yyyy-MM-dd");
    const entry = entries.get(key);
    setSelectedDay({ date: key, entry });
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg bg-secondary text-foreground">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-display font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg bg-secondary text-foreground">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex gap-3 mb-4 justify-center flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-success" /> {t("calendar.saved", savedCount)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-danger" /> {t("calendar.missed", missedCount)}
        </div>
        {totalAmount > 0 && (
          <div className="text-xs text-primary font-bold">{formatCurrency(totalAmount)} {t("share.saved")}</div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[10px] font-body text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

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
            const entry = entries.get(key);
            const future = isFuture(day);
            const today = isToday(day);

            let bg = "bg-secondary/30";
            if (entry?.saved === true) bg = "bg-success/80";
            else if (entry?.saved === false) bg = "bg-danger/60";

            return (
              <button
                key={key}
                onClick={() => handleDayClick(day)}
                disabled={future}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-body transition-colors ${bg} ${
                  today ? "ring-2 ring-primary" : ""
                } ${future ? "opacity-30 cursor-default" : "cursor-pointer active:scale-95"}`}
              >
                <span>{format(day, "d")}</span>
                {entry?.amount && (
                  <span className="text-[8px] text-primary-foreground/70">{formatCurrency(entry.amount)}</span>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Day detail popup */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-xs w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-foreground">{selectedDay.date}</h3>
                <button onClick={() => setSelectedDay(null)} className="text-muted-foreground">
                  <X size={20} />
                </button>
              </div>

              {selectedDay.entry ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-5xl">
                    {selectedDay.entry.saved ? "✅" : "❌"}
                  </div>
                  <p className="font-display font-semibold text-foreground">
                    {selectedDay.entry.saved
                      ? (lang === "ru" ? "Сэкономлено" : "Saved")
                      : (lang === "ru" ? "Не сэкономлено" : "Not saved")}
                  </p>
                  {selectedDay.entry.saved && selectedDay.entry.category && (
                    <p className="text-sm font-body text-muted-foreground bg-secondary px-3 py-1 rounded-lg">
                      {selectedDay.entry.category}
                    </p>
                  )}
                  {selectedDay.entry.saved && selectedDay.entry.amount && (
                    <p className="text-2xl font-display font-bold text-primary">
                      {formatCurrency(selectedDay.entry.amount)}
                    </p>
                  )}
                  {selectedDay.entry.saved && !selectedDay.entry.amount && (
                    <p className="text-sm text-muted-foreground font-body">
                      {lang === "ru" ? "Сумма не указана" : "No amount specified"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-5xl">📅</div>
                  <p className="text-sm text-muted-foreground font-body">
                    {lang === "ru" ? "Нет записи за этот день" : "No entry for this day"}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
