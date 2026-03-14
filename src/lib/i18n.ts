export type Language = "en" | "ru";

export type CurrencyCode = "USD" | "EUR" | "RUB" | "KGS";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  labelRu: string;
  emoji: string;
};

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "Dollar", labelRu: "Доллар", emoji: "💵" },
  { code: "EUR", symbol: "€", label: "Euro", labelRu: "Евро", emoji: "💶" },
  { code: "RUB", symbol: "₽", label: "Ruble", labelRu: "Рубль", emoji: "🇷🇺" },
  { code: "KGS", symbol: "с", label: "Som", labelRu: "Сом", emoji: "🇰🇬" },
];

export type DreamCategory = {
  id: string;
  emoji: string;
  labelEn: string;
  labelRu: string;
};

export const DREAM_CATEGORIES: DreamCategory[] = [
  { id: "education", emoji: "🎓", labelEn: "Education", labelRu: "Учёба" },
  { id: "apartment", emoji: "🏠", labelEn: "Apartment", labelRu: "Квартира" },
  { id: "car", emoji: "🚗", labelEn: "Car", labelRu: "Машина" },
  { id: "travel", emoji: "✈️", labelEn: "Travel", labelRu: "Путешествие" },
  { id: "phone", emoji: "📱", labelEn: "Phone / Gadget", labelRu: "Телефон / Гаджет" },
  { id: "pc", emoji: "💻", labelEn: "Computer", labelRu: "Компьютер" },
  { id: "wedding", emoji: "💍", labelEn: "Wedding", labelRu: "Свадьба" },
  { id: "emergency", emoji: "🛡️", labelEn: "Emergency Fund", labelRu: "Подушка безопасности" },
  { id: "business", emoji: "🏢", labelEn: "Business", labelRu: "Бизнес" },
  { id: "other", emoji: "⭐", labelEn: "Other", labelRu: "Другое" },
];

export type Preferences = {
  language: Language;
  currency: CurrencyCode;
  onboarded: boolean;
  dreamId?: string | null;
  dreamCustomName?: string | null;
};

const PREFS_KEY = "did-i-save-prefs";

export function getPreferences(): Preferences {
  const raw = localStorage.getItem(PREFS_KEY);
  return raw
    ? JSON.parse(raw)
    : { language: "en", currency: "USD", onboarded: false, dreamId: null, dreamCustomName: null };
}

export function updatePreferences(partial: Partial<Preferences>): void {
  const current = getPreferences();
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...partial }));
}

export function getCurrencySymbol(): string {
  const prefs = getPreferences();
  return CURRENCIES.find((c) => c.code === prefs.currency)?.symbol || "$";
}

export function formatCurrency(amount: number): string {
  const sym = getCurrencySymbol();
  const formatted = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
  return `${formatted}${sym}`;
}

export function getDreamLabel(): string | null {
  const prefs = getPreferences();
  if (!prefs.dreamId) return null;
  if (prefs.dreamId === "other" && prefs.dreamCustomName) return prefs.dreamCustomName;
  const cat = DREAM_CATEGORIES.find((c) => c.id === prefs.dreamId);
  if (!cat) return null;
  return prefs.language === "ru" ? cat.labelRu : cat.labelEn;
}

export function getDreamEmoji(): string | null {
  const prefs = getPreferences();
  if (!prefs.dreamId) return null;
  const cat = DREAM_CATEGORIES.find((c) => c.id === prefs.dreamId);
  return cat?.emoji || "⭐";
}

// --- Translations ---

const translations = {
  en: {
    "app.title": "Did you save\nmoney today?",
    "btn.yes": "✅ YES",
    "btn.no": "❌ NO",
    "streak.days": (n: number) => `day${n !== 1 ? "s" : ""} streak`,
    "streak.none": "No streak yet — start today!",
    "goal.title": "Savings Goal",
    "goal.reached": "🎉 Goal reached!",
    "answered.yes": "Great job! Keep the streak going!",
    "answered.yes.amount": (amount: string) => `You saved ${amount} today!`,
    "answered.no": "That's okay. Try again tomorrow!",
    "answered.change": "Change answer",
    "answered.addMore": "Add more savings",
    "cancel": "Cancel",
    "calendar.detail.saved": "Saved",
    "calendar.detail.notSaved": "Not saved",
    "calendar.detail.noAmount": "No amount specified",
    "calendar.detail.noEntry": "No entry for this day",
    "calendar.detail.total": "Total",
    "amount.question": "How much did you save?",
    "amount.hint": "At least an approximate amount",
    "amount.save": "Save ✅",
    "amount.skip": "Skip",
    "amount.required": "Enter an amount",
    "category.question": "What did you save on?",
    "category.skip": "Skip",
    "category.food": "🍔 Food",
    "category.coffee": "☕ Coffee",
    "category.transport": "🚌 Transport",
    "category.clothes": "👕 Clothes",
    "category.entertainment": "🎬 Entertainment",
    "category.shopping": "🛍️ Shopping",
    "category.other": "📝 Other",
    "review.title": "Your savings today",
    "review.total": "Total",
    "review.done": "Done ✅",
    "review.addMore": "Add more",
    "review.itemCount": (n: number) => `${n} item${n !== 1 ? "s" : ""} added`,
    "history.title": "History",
    "history.week": "This Week",
    "history.month": "This Month",
    "history.streak": "Current Streak",
    "history.total": "Total Saved",
    "history.days.saved": "days saved",
    "calendar.saved": (n: number) => `${n} saved`,
    "calendar.missed": (n: number) => `${n} missed`,
    "achievements.title": "Achievements",
    "achievements.best": (n: number) => `Best streak: ${n} days`,
    "achievements.unlocked": "Achievement Unlocked!",
    "achievements.awesome": "Awesome! 🎉",
    "settings.title": "Settings",
    "settings.goal": "Savings Goal",
    "settings.set": "Set",
    "settings.clear": "Clear goal",
    "settings.premium": "Premium",
    "settings.premium.active": "Premium Active",
    "settings.premium.go": "Go Premium",
    "settings.premium.thanks": "Ads removed. Thank you!",
    "settings.premium.price": "Remove ads for $0.99",
    "settings.premium.upgrade": "Upgrade — $0.99",
    "settings.premium.downgrade": "Restore Ads (Downgrade)",
    "settings.language": "Language",
    "settings.currency": "Currency",
    "settings.dream": "My Dream",
    "settings.dream.select": "What are you saving for?",
    "settings.dream.custom": "Enter your dream",
    "settings.dream.clear": "Clear dream",
    "settings.about.name": "Did I Save Today? v1.0",
    "settings.about.local": "Data saved locally on your device",
    "nav.today": "Today",
    "nav.history": "History",
    "nav.badges": "Badges",
    "nav.settings": "Settings",
    "ad.text": "Ad Space — AdMob Banner",
    "share.saving.for": "I've been saving for",
    "share.days": "days",
    "share.saved": "saved",
    "share.app": "Did I Save Today? 💰",
    "share.btn": "Share",
    "welcome.title": "Welcome! 👋",
    "welcome.subtitle": "Choose your currency",
    "welcome.start": "Get Started",
    "achievement.weekWarrior": "Week Warrior",
    "achievement.weekWarrior.desc": "7 day streak",
    "achievement.monthlyMaster": "Monthly Master",
    "achievement.monthlyMaster.desc": "30 day streak",
    "achievement.savingsLegend": "Savings Legend",
    "achievement.savingsLegend.desc": "100 day streak",
    "dream.saving.for": "Saving for:",
  },
  ru: {
    "app.title": "Ты сэкономил\nденьги сегодня?",
    "btn.yes": "✅ ДА",
    "btn.no": "❌ НЕТ",
    "streak.days": (n: number) => {
      if (n % 10 === 1 && n % 100 !== 11) return "день подряд";
      if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "дня подряд";
      return "дней подряд";
    },
    "streak.none": "Пока нет серии — начни сегодня!",
    "goal.title": "Цель накоплений",
    "goal.reached": "🎉 Цель достигнута!",
    "answered.yes": "Отлично! Продолжай в том же духе!",
    "answered.yes.amount": (amount: string) => `Ты сэкономил ${amount} сегодня!`,
    "answered.no": "Ничего страшного. Попробуй завтра!",
    "answered.change": "Изменить ответ",
    "answered.addMore": "Добавить ещё",
    "cancel": "Отмена",
    "calendar.detail.saved": "Сэкономлено",
    "calendar.detail.notSaved": "Не сэкономлено",
    "calendar.detail.noAmount": "Сумма не указана",
    "calendar.detail.noEntry": "Нет записи за этот день",
    "calendar.detail.total": "Итого",
    "amount.question": "Сколько ты сэкономил?",
    "amount.hint": "Хотя бы примерную сумму",
    "amount.save": "Сохранить ✅",
    "amount.skip": "Пропустить",
    "amount.required": "Введите сумму",
    "category.question": "На чём ты сэкономил?",
    "category.skip": "Пропустить",
    "category.food": "🍔 Еда",
    "category.coffee": "☕ Кофе",
    "category.transport": "🚌 Транспорт",
    "category.clothes": "👕 Одежда",
    "category.entertainment": "🎬 Развлечения",
    "category.shopping": "🛍️ Покупки",
    "category.other": "📝 Другое",
    "review.title": "Твои экономии за сегодня",
    "review.total": "Итого",
    "review.done": "Готово ✅",
    "review.addMore": "Ещё",
    "review.itemCount": (n: number) => `${n} ${n === 1 ? "запись" : "записей"} добавлено`,
    "history.title": "История",
    "history.week": "Эта неделя",
    "history.month": "Этот месяц",
    "history.streak": "Текущая серия",
    "history.total": "Всего сэкономлено",
    "history.days.saved": "дней сэкономлено",
    "calendar.saved": (n: number) => `${n} сэконом.`,
    "calendar.missed": (n: number) => `${n} пропущ.`,
    "achievements.title": "Достижения",
    "achievements.best": (n: number) => `Лучшая серия: ${n} дней`,
    "achievements.unlocked": "Достижение разблокировано!",
    "achievements.awesome": "Круто! 🎉",
    "settings.title": "Настройки",
    "settings.goal": "Цель накоплений",
    "settings.set": "Задать",
    "settings.clear": "Сбросить цель",
    "settings.premium": "Премиум",
    "settings.premium.active": "Премиум активен",
    "settings.premium.go": "Стать Премиум",
    "settings.premium.thanks": "Реклама убрана. Спасибо!",
    "settings.premium.price": "Убрать рекламу за $0.99",
    "settings.premium.upgrade": "Улучшить — $0.99",
    "settings.premium.downgrade": "Вернуть рекламу",
    "settings.language": "Язык",
    "settings.currency": "Валюта",
    "settings.dream": "Моя мечта",
    "settings.dream.select": "На что ты копишь?",
    "settings.dream.custom": "Введи свою мечту",
    "settings.dream.clear": "Сбросить мечту",
    "settings.about.name": "Did I Save Today? v1.0",
    "settings.about.local": "Данные сохраняются локально на устройстве",
    "nav.today": "Сегодня",
    "nav.history": "История",
    "nav.badges": "Значки",
    "nav.settings": "Настройки",
    "ad.text": "Рекламное место — AdMob",
    "share.saving.for": "Я коплю уже",
    "share.days": "дней",
    "share.saved": "накоплено",
    "share.app": "Did I Save Today? 💰",
    "share.btn": "Поделиться",
    "welcome.title": "Добро пожаловать! 👋",
    "welcome.subtitle": "Выберите валюту",
    "welcome.start": "Начать",
    "achievement.weekWarrior": "Недельный воин",
    "achievement.weekWarrior.desc": "Серия 7 дней",
    "achievement.monthlyMaster": "Мастер месяца",
    "achievement.monthlyMaster.desc": "Серия 30 дней",
    "achievement.savingsLegend": "Легенда экономии",
    "achievement.savingsLegend.desc": "Серия 100 дней",
    "dream.saving.for": "Коплю на:",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, ...args: any[]): string {
  const prefs = getPreferences();
  const lang = prefs.language;
  const val = translations[lang][key];
  if (typeof val === "function") return (val as any)(...args);
  return val as string;
}
