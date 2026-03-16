import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";

export type SavingItem = {
  amount?: number;
  category?: string;
};

export type DayEntry = {
  date: string; // YYYY-MM-DD
  saved: boolean;
  amount?: number; // legacy, total
  category?: string; // legacy, first item
  items?: SavingItem[];
};

type SavingsGoal = {
  target: number;
  startDate: string;
};

type AppSettings = {
  isPremium: boolean;
  savingsGoal: SavingsGoal | null;
  seenAchievements: string[];
};

const STORAGE_KEY = "did-i-save-today";
const SETTINGS_KEY = "did-i-save-settings";

// --- Entries ---

export function getAllEntries(): DayEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getEntryForDate(date: Date): DayEntry | undefined {
  const key = format(date, "yyyy-MM-dd");
  return getAllEntries().find((e) => e.date === key);
}

export function saveEntry(date: Date, saved: boolean, items?: SavingItem[]): void {
  const entries = getAllEntries();
  const key = format(date, "yyyy-MM-dd");
  const existing = entries.findIndex((e) => e.date === key);

  const totalAmount = items?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
  const entry: DayEntry = {
    date: key,
    saved,
    amount: saved && totalAmount > 0 ? totalAmount : undefined,
    items: saved && items && items.length > 0 ? items : undefined,
  };

  if (existing >= 0) {
    // If adding to existing saved day, merge items
    const prev = entries[existing];
    if (saved && prev.saved && prev.items) {
      const mergedItems = [...prev.items, ...(items || [])];
      const mergedTotal = mergedItems.reduce((sum, i) => sum + (i.amount || 0), 0);
      entry.items = mergedItems;
      entry.amount = mergedTotal > 0 ? mergedTotal : undefined;
    }
    entries[existing] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Helper to get all items for an entry, supporting legacy format */
export function getEntryItems(entry: DayEntry): SavingItem[] {
  if (entry.items && entry.items.length > 0) return entry.items;
  if (entry.saved && (entry.amount || entry.category)) {
    return [{ amount: entry.amount, category: entry.category }];
  }
  return [];
}

export function getStreak(): number {
  const entries = getAllEntries();
  if (entries.length === 0) return 0;

  const map = new Map(entries.map((e) => [e.date, e.saved]));
  let streak = 0;
  let current = new Date();

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

export function getLongestStreak(): number {
  const entries = getAllEntries().sort((a, b) => a.date.localeCompare(b.date));
  let longest = 0;
  let current = 0;
  let lastDate: string | null = null;

  for (const entry of entries) {
    if (!entry.saved) {
      current = 0;
      lastDate = entry.date;
      continue;
    }
    if (lastDate) {
      const diff = Math.round(
        (new Date(entry.date).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    longest = Math.max(longest, current);
    lastDate = entry.date;
  }

  return longest;
}

export function hasAnsweredToday(): boolean {
  return !!getEntryForDate(new Date());
}

// --- Savings Goal ---

export function getSettings(): AppSettings {
  const raw = localStorage.getItem(SETTINGS_KEY);
  return raw
    ? JSON.parse(raw)
    : { isPremium: false, savingsGoal: null, seenAchievements: [] };
}

export function updateSettings(partial: Partial<AppSettings>): void {
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...partial }));
}

export function getTotalSaved(): number {
  return getAllEntries()
    .filter((e) => e.saved && e.amount)
    .reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function getTotalSavedSinceGoal(): number {
  const settings = getSettings();
  if (!settings.savingsGoal) return getTotalSaved();
  return getAllEntries()
    .filter((e) => e.saved && e.amount && e.date >= settings.savingsGoal!.startDate)
    .reduce((sum, e) => sum + (e.amount || 0), 0);
}

// --- Stats ---

export function getWeekStats(): { saved: number; total: number } {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const entries = getAllEntries();
  const map = new Map(entries.map((e) => [e.date, e]));

  const answered = days.filter((d) => {
    const key = format(d, "yyyy-MM-dd");
    return map.has(key);
  });
  const saved = days.filter((d) => {
    const key = format(d, "yyyy-MM-dd");
    return map.get(key)?.saved === true;
  });

  return { saved: saved.length, total: 7 };
}

export function getMonthStats(): { saved: number; total: number } {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const entries = getAllEntries();
  const map = new Map(entries.map((e) => [e.date, e]));

  const saved = days.filter((d) => {
    const key = format(d, "yyyy-MM-dd");
    return map.get(key)?.saved === true;
  });

  return { saved: saved.length, total: days.length };
}

// --- Achievements ---

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requirement: number; // streak days
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "streak-7", title: "Week Warrior", description: "7 day streak", emoji: "⭐", requirement: 7 },
  { id: "streak-30", title: "Monthly Master", description: "30 day streak", emoji: "🏆", requirement: 30 },
  { id: "streak-100", title: "Savings Legend", description: "100 day streak", emoji: "💎", requirement: 100 },
];

export function getUnlockedAchievements(): Achievement[] {
  const streak = getStreak();
  const longest = getLongestStreak();
  const best = Math.max(streak, longest);
  return ACHIEVEMENTS.filter((a) => best >= a.requirement);
}

export function getNewAchievements(): Achievement[] {
  const settings = getSettings();
  const unlocked = getUnlockedAchievements();
  return unlocked.filter((a) => !settings.seenAchievements.includes(a.id));
}

export function markAchievementSeen(id: string): void {
  const settings = getSettings();
  if (!settings.seenAchievements.includes(id)) {
    updateSettings({ seenAchievements: [...settings.seenAchievements, id] });
  }
}

