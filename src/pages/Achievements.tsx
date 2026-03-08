import BottomNav from "@/components/BottomNav";
import { ACHIEVEMENTS, getUnlockedAchievements, getStreak, getLongestStreak } from "@/lib/storage";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const Achievements = () => {
  const unlocked = getUnlockedAchievements();
  const unlockedIds = new Set(unlocked.map((a) => a.id));
  const streak = getStreak();
  const longest = getLongestStreak();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 px-6 pt-10 pb-6">
        <h1 className="text-2xl font-display font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Best streak: {Math.max(streak, longest)} days
        </p>

        <div className="flex flex-col gap-4">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  isUnlocked
                    ? "bg-card border-primary/30"
                    : "bg-secondary/30 border-border opacity-50"
                }`}
              >
                <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl bg-secondary">
                  {isUnlocked ? achievement.emoji : <Lock size={20} className="text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-foreground">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground font-body">{achievement.description}</p>
                </div>
                {isUnlocked && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-body font-bold">
                    ✓
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Achievements;
