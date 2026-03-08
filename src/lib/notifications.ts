export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleDailyReminder(): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const now = new Date();
  const target = new Date();
  target.setHours(21, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    new Notification("Did you save today? 💰", {
      body: "Don't break your streak! Log your savings now.",
      icon: "/pwa-192x192.png",
    });
    // Reschedule for next day
    scheduleDailyReminder();
  }, delay);
}
