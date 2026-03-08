import CalendarView from "@/components/CalendarView";
import BottomNav from "@/components/BottomNav";
import { getStreak } from "@/lib/storage";

const History = () => {
  const streak = getStreak();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 px-6 pt-12 pb-6">
        <h1 className="text-2xl font-display font-bold mb-2">Your History</h1>
        <p className="text-muted-foreground font-body mb-8">
          Current streak: <span className="text-primary font-bold">🔥 {streak} day{streak !== 1 ? "s" : ""}</span>
        </p>
        <CalendarView />
      </div>
      <BottomNav />
    </div>
  );
};

export default History;
