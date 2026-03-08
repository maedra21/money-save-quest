export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleNotifications(): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  scheduleAt(21, 0, "Did you save today? 💰", "Don't break your streak! Log your savings now.");
  scheduleAt(22, 30, "⚠️ Your streak is at risk!", "Answer before midnight to keep your streak alive.");
}

function scheduleAt(hour: number, minute: number, title: string, body: string): void {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    // Only send the 10:30 warning if user hasn't answered
    if (hour === 22) {
      const todayKey = new Date().toISOString().split("T")[0];
      const entries = JSON.parse(localStorage.getItem("did-i-save-today") || "[]");
      const answered = entries.some((e: any) => e.date === todayKey);
      if (answered) {
        scheduleAt(hour, minute, title, body);
        return;
      }
    }

    new Notification(title, {
      body,
      icon: "/pwa-192x192.png",
    });
    scheduleAt(hour, minute, title, body);
  }, delay);
}
