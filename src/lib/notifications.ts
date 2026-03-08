import { getPreferences } from "./i18n";

const NOTIFICATION_MESSAGES_EN = [
  { title: "💰 Hey, how was today?", body: "Did you manage to save something? Let's find out!" },
  { title: "🐷 Your piggy bank is waiting!", body: "Even a small amount counts. Did you save today?" },
  { title: "📊 Quick check-in time", body: "One tap — that's all it takes to track your progress." },
  { title: "🌟 End of day recap", body: "Before you relax, let's log today's savings!" },
  { title: "🎯 Closer to your dream?", body: "Every saved coin is a step forward. How was today?" },
  { title: "☕ Skipped that latte?", body: "Small wins matter! Log what you saved today." },
  { title: "🔥 Don't let the streak die!", body: "Your future self will thank you. Quick check-in?" },
  { title: "💪 Savings check", body: "Another day, another chance to grow. Did you save?" },
  { title: "🏆 Champions save daily", body: "You're building a habit. Let's keep it going!" },
  { title: "✨ Almost bedtime!", body: "One quick tap before sleep — did you save today?" },
  { title: "🎰 What's today's score?", body: "No judgment, just tracking. How much did you save?" },
  { title: "🧮 Numbers time!", body: "Let's add today's savings to the total." },
];

const NOTIFICATION_MESSAGES_RU = [
  { title: "💰 Как прошёл день?", body: "Удалось что-то сэкономить? Давай запишем!" },
  { title: "🐷 Копилка ждёт!", body: "Даже мелочь считается. Сэкономил сегодня?" },
  { title: "📊 Быстрая проверка", body: "Один тап — и прогресс записан. Заходи!" },
  { title: "🌟 Итоги дня", body: "Перед отдыхом — запиши свои накопления!" },
  { title: "🎯 Ближе к мечте?", body: "Каждая монетка — шаг вперёд. Как сегодня?" },
  { title: "☕ Не купил кофе?", body: "Маленькие победы важны! Запиши экономию." },
  { title: "🔥 Не потеряй серию!", body: "Будущий ты скажет спасибо. Зайди на минутку?" },
  { title: "💪 Проверка накоплений", body: "Ещё один день — ещё один шанс. Сэкономил?" },
  { title: "🏆 Чемпионы копят каждый день", body: "Ты формируешь привычку. Продолжай!" },
  { title: "✨ Скоро спать!", body: "Один тап перед сном — сэкономил сегодня?" },
  { title: "🎰 Какой сегодня счёт?", body: "Без осуждения — просто трекинг. Сколько сэкономил?" },
  { title: "🧮 Время цифр!", body: "Давай добавим сегодняшнюю экономию к общей сумме." },
];

function getRandomMessage() {
  const lang = getPreferences().language;
  const messages = lang === "ru" ? NOTIFICATION_MESSAGES_RU : NOTIFICATION_MESSAGES_EN;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return messages[dayOfYear % messages.length];
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleNotifications(): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  scheduleDaily();
}

function scheduleDaily(): void {
  const now = new Date();
  const target = new Date();
  target.setHours(22, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    const todayKey = new Date().toISOString().split("T")[0];
    const entries = JSON.parse(localStorage.getItem("did-i-save-today") || "[]");
    const answered = entries.some((e: any) => e.date === todayKey);

    if (!answered) {
      const msg = getRandomMessage();
      new Notification(msg.title, {
        body: msg.body,
        icon: "/pwa-192x192.png",
      });
    }

    // Reschedule for next day
    scheduleDaily();
  }, delay);
}
