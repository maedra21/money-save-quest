import CalendarView from "@/components/CalendarView";
import BottomNav from "@/components/BottomNav";
import { getStreak, getWeekStats, getMonthStats, getTotalSaved } from "@/lib/storage";
import { Share2 } from "lucide-react";
import { useState } from "react";
import ShareCard from "@/components/ShareCard";

const History = () => {
  const streak = getStreak();
  const week = getWeekStats();
  const month = getMonthStats();
  const totalSaved = getTotalSaved();
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 px-6 pt-10 pb-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold">History</h1>
          <button
            onClick={() => setShowShare(true)}
            className="p-2 rounded-lg bg-secondary text-primary"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-1">This Week</p>
            <p className="text-xl font-display font-bold text-foreground">
              {week.saved}<span className="text-muted-foreground text-sm font-normal">/{week.total}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">days saved</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-1">This Month</p>
            <p className="text-xl font-display font-bold text-foreground">
              {month.saved}<span className="text-muted-foreground text-sm font-normal">/{month.total}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">days saved</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-1">Current Streak</p>
            <p className="text-xl font-display font-bold text-primary">🔥 {streak}</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground font-body mb-1">Total Saved</p>
            <p className="text-xl font-display font-bold text-primary">${totalSaved.toFixed(0)}</p>
          </div>
        </div>

        <CalendarView />
      </div>

      {showShare && <ShareCard streak={streak} totalSaved={totalSaved} onClose={() => setShowShare(false)} />}

      <BottomNav />
    </div>
  );
};

export default History;
