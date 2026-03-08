import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNewAchievements, markAchievementSeen, Achievement } from "@/lib/storage";
import { t } from "@/lib/i18n";

const AchievementPopup = () => {
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    const newOnes = getNewAchievements();
    if (newOnes.length > 0) {
      setCurrent(newOnes[0]);
    }
  }, []);

  const dismiss = () => {
    if (current) {
      markAchievementSeen(current.id);
      const remaining = getNewAchievements();
      setCurrent(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-7xl"
            >
              {current.emoji}
            </motion.div>
            <h2 className="text-xl font-display font-bold text-foreground">{t("achievements.unlocked")}</h2>
            <p className="text-lg font-display font-semibold text-primary">{current.title}</p>
            <p className="text-sm text-muted-foreground font-body">{current.description}</p>

            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: 0,
                }}
                transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["hsl(145,72%,45%)", "hsl(50,90%,55%)", "hsl(200,80%,60%)", "hsl(330,80%,60%)"][i % 4],
                }}
              />
            ))}

            <button
              onClick={dismiss}
              className="mt-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-display font-bold"
            >
              {t("achievements.awesome")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementPopup;
