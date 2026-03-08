import { motion } from "framer-motion";
import { getSettings, getTotalSavedSinceGoal } from "@/lib/storage";
import { t, formatCurrency } from "@/lib/i18n";

const GoalProgress = () => {
  const settings = getSettings();
  if (!settings.savingsGoal) return null;

  const saved = getTotalSavedSinceGoal();
  const target = settings.savingsGoal.target;
  const progress = Math.min((saved / target) * 100, 100);
  const isComplete = saved >= target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xs"
    >
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-body text-muted-foreground">{t("goal.title")}</span>
        <span className="text-sm font-display font-bold text-foreground">
          {formatCurrency(saved)} <span className="text-muted-foreground font-normal">/ {formatCurrency(target)}</span>
        </span>
      </div>
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${isComplete ? "bg-primary animate-pulse-glow" : "bg-primary"}`}
        />
      </div>
      {isComplete && (
        <p className="text-xs text-primary font-body mt-1 text-center">{t("goal.reached")}</p>
      )}
    </motion.div>
  );
};

export default GoalProgress;
