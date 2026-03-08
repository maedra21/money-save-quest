import { format, differenceInCalendarDays, subDays, parseISO } from "date-fns";

export type DayEntry = {
  date: string; // YYYY-MM-DD
  saved: boolean;
};

const STORAGE_KEY = "did-i-save-today";

export function getAllEntries(): DayEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getEntryForDate(date: Date): DayEntry | undefined {
  const key = format(date, "yyyy-MM-dd");
  return getAllEntries().find((e) => e.date === key);
}

export function saveEntry(date: Date, saved: boolean): void {
  const entries = getAllEntries();
  const key = format(date, "yyyy-MM-dd");
  const existing = entries.findIndex((e) => e.date === key);
  if (existing >= 0) {
    entries[existing].saved = saved;
  } else {
    entries.push({ date: key, saved });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getStreak(): number {
  const entries = getAllEntries();
  if (entries.length === 0) return 0;

  const map = new Map(entries.map((e) => [e.date, e.saved]));
  let streak = 0;
  let current = new Date();

  // If today hasn't been answered yet, start checking from yesterday
  const todayKey = format(current, "yyyy-MM-dd");
  if (!map.has(todayKey)) {
    current = subDays(current, 1);
  }

  while (true) {
    const key = format(current, "yyyy-MM-dd");
    if (map.get(key) === true) {
      streak++;
      current = subDays(current, 1);
    } else {
      break;
    }
  }

  return streak;
}

export function hasAnsweredToday(): boolean {
  return !!getEntryForDate(new Date());
}
