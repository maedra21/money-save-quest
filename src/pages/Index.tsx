import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StreakDisplay from "@/components/StreakDisplay";
import SaveButtons from "@/components/SaveButtons";

import DreamBanner from "@/components/DreamBanner";
import TotalSaved from "@/components/TotalSaved";
import DailyQuote from "@/components/DailyQuote";
import AchievementPopup from "@/components/AchievementPopup";

import BottomNav from "@/components/BottomNav";
import { getStreak, hasAnsweredToday, saveEntry, getEntryForDate, getEntryItems } from "@/lib/storage";
import type { SavingItem } from "@/lib/storage";
import { requestNotificationPermission, scheduleNotifications } from "@/lib/notifications";
import { t, formatCurrency } from "@/lib/i18n";

const Index = () => {
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [todayAnswer, setTodayAnswer] = useState<boolean | null>(null);
  const [todayAmount, setTodayAmount] = useState<number | undefined>();
  const [addingMore, setAddingMore] = useState(false);

  const refresh = useCallback(() => {
    setStreak(getStreak());
    setAnswered(hasAnsweredToday());
    const entry = getEntryForDate(new Date());
    setTodayAnswer(entry?.saved ?? null);
    setTodayAmount(entry?.amount);
  }, []);

  useEffect(() => {
    refresh();
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleNotifications();
    });
  }, [refresh]);

  const handleAnswer = (saved: boolean, items?: SavingItem[]) => {
    saveEntry(new Date(), saved, items);
    setAddingMore(false);
    refresh();
  };

  const handleAddMore = () => {
    setAddingMore(true);
  };

  const titleLines = t("app.title").split("\n");

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <AchievementPopup />

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-8 w-full max-w-sm mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-display font-bold text-center leading-tight"
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </motion.h1>

        <StreakDisplay streak={streak} />

        <DreamBanner />
        <TotalSaved />

        <AnimatePresence mode="wait">
          {answered && !addingMore ? (
            <motion.div
              key="answered"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-5xl">{todayAnswer ? "🎉" : "😔"}</div>
              <p className="text-lg font-body text-muted-foreground text-center">
                {todayAnswer
                  ? (() => {
                      const entry = getEntryForDate(new Date());
                      const items = entry ? getEntryItems(entry) : [];
                      if (items.length > 1) {
                        return t("answered.yes.amount", formatCurrency(todayAmount || 0));
                      }
                      return todayAmount
                        ? t("answered.yes.amount", formatCurrency(todayAmount))
                        : t("answered.yes");
                    })()
                  : t("answered.no")}
              </p>
              <div className="flex gap-3 w-full max-w-xs justify-center">
                {todayAnswer && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddMore}
                    className="py-3 px-5 rounded-xl bg-primary/10 text-primary font-display font-bold text-sm border border-primary/30"
                  >
                    {t("answered.addMore")}
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAnswered(false)}
                  className="py-3 px-5 rounded-xl bg-secondary text-muted-foreground font-body text-sm border border-border"
                >
                  {t("answered.change")}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="buttons"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-center w-full"
            >
              <SaveButtons
                onAnswer={handleAnswer}
                disabled={false}
                addingMore={addingMore}
                onCancel={() => { setAddingMore(false); refresh(); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <DailyQuote />
      </div>

      
      <BottomNav />
    </div>
  );
};

export default Index;
