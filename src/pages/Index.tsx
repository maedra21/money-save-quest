import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StreakDisplay from "@/components/StreakDisplay";
import SaveButtons from "@/components/SaveButtons";
import AdBanner from "@/components/AdBanner";
import BottomNav from "@/components/BottomNav";
import { getStreak, hasAnsweredToday, saveEntry, getEntryForDate } from "@/lib/storage";
import { requestNotificationPermission, scheduleDailyReminder } from "@/lib/notifications";

const Index = () => {
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [todayAnswer, setTodayAnswer] = useState<boolean | null>(null);

  const refresh = useCallback(() => {
    setStreak(getStreak());
    setAnswered(hasAnsweredToday());
    const entry = getEntryForDate(new Date());
    setTodayAnswer(entry?.saved ?? null);
  }, []);

  useEffect(() => {
    refresh();
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleDailyReminder();
    });
  }, [refresh]);

  const handleAnswer = (saved: boolean) => {
    saveEntry(new Date(), saved);
    refresh();
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-display font-bold text-center leading-tight"
        >
          Did you save
          <br />
          money today?
        </motion.h1>

        <StreakDisplay streak={streak} />

        <AnimatePresence mode="wait">
          {answered ? (
            <motion.div
              key="answered"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-5xl">{todayAnswer ? "🎉" : "😔"}</div>
              <p className="text-lg font-body text-muted-foreground text-center">
                {todayAnswer
                  ? "Great job! Keep the streak going!"
                  : "That's okay. Try again tomorrow!"}
              </p>
              <button
                onClick={() => {
                  // Allow changing answer
                  setAnswered(false);
                }}
                className="text-sm text-muted-foreground underline mt-2"
              >
                Change answer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-center"
            >
              <SaveButtons onAnswer={handleAnswer} disabled={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AdBanner />
      <BottomNav />
    </div>
  );
};

export default Index;
