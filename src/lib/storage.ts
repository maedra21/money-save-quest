import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";

export type DayEntry = {
  date: string; // YYYY-MM-DD
  saved: boolean;
  amount?: number;
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

export function saveEntry(date: Date, saved: boolean, amount?: number): void {
  const entries = getAllEntries();
  const key = format(date, "yyyy-MM-dd");
  const existing = entries.findIndex((e) => e.date === key);
  const entry: DayEntry = { date: key, saved, amount: saved ? amount : undefined };
  if (existing >= 0) {
    entries[existing] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
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

// --- Quotes ---

const QUOTES = [
  "A penny saved is a penny earned. — Benjamin Franklin",
  "Do not save what is left after spending, but spend what is left after saving. — Warren Buffett",
  "The habit of saving is itself an education. — T.T. Munger",
  "Small amounts saved daily add up to huge investments in the end.",
  "It's not your salary that makes you rich, it's your spending habits. — Charles A. Jaffe",
  "Money looks better in the bank than on your feet. — Sophia Amoruso",
  "Every time you borrow money, you're robbing your future self. — Nathan W. Morris",
  "The art is not in making money, but in keeping it. — Proverb",
  "Financial peace isn't the acquisition of stuff. It's learning to live on less. — Dave Ramsey",
  "Rich is not about having a lot of money. It's about having a lot of options.",
  "Save a little money each month and at the end of the year you'll be surprised at how little you have. — Ernest Haskins",
  "Don't tell me what you value, show me your budget. — Joe Biden",
  "Beware of little expenses; a small leak will sink a great ship. — Benjamin Franklin",
  "The secret to wealth is simple: spend less than you earn and invest the difference.",
  "Saving requires us to not get things now so that we can get bigger things later.",
  "You don't have to see the whole staircase, just take the first step. — Martin Luther King Jr.",
  "Wealth consists not in having great possessions, but in having few wants. — Epictetus",
  "The best time to save was yesterday. The second best time is now.",
  "Your savings rate is more important than your investment returns.",
  "Compound interest is the eighth wonder of the world. — Albert Einstein",
  "Today's $5 saved is tomorrow's $50 earned.",
  "Financial freedom is available to those who learn about it and work for it. — Robert Kiyosaki",
  "It is never too early to encourage long-term savings. — Ron Lewis",
  "Stop buying things you don't need, to impress people you don't even like.",
  "A budget is telling your money where to go instead of wondering where it went. — Dave Ramsey",
  "The more you save, the more options you create for your future.",
  "Little by little, one travels far. — J.R.R. Tolkien",
  "Money saved today is freedom earned tomorrow.",
  "Saving is a great habit but without investing, the money loses its value. — Varun Agarwal",
  "The journey of a thousand miles begins with a single step — and a single dollar saved.",
];

export function getDailyQuote(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
