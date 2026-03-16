import { motion } from "framer-motion";
import { getDreamLabel, getDreamEmoji, t } from "@/lib/i18n";
import { getTotalSavedSinceGoal, getSettings } from "@/lib/storage";
import { formatCurrency } from "@/lib/i18n";

const DreamBanner = () => {
  const label = getDreamLabel();
  const emoji = getDreamEmoji();
  const settings = getSettings();
  const goal = settings.savingsGoal;
  const saved = getTotalSavedSinceGoal();

  if (!label) return null;

  const target = goal?.target;
  const progress = target ? Math.min((saved / target) * 100, 100) : null;
  const isComplete = target ? saved >= target : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xs bg-card rounded-2xl p-4 border border-primary/20"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-body">{t("dream.saving.for")}</p>
          <p className="font-display font-bold text-foreground truncate">{label}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-display font-bold text-primary">
            {formatCurrency(saved)}
            {target && <span className="text-muted-foreground font-normal text-xs"> / {formatCurrency(target)}</span>}
          </p>
        </div>
      </div>
      {progress !== null && (
        <div className="mt-3">
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
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
        </div>
      )}
    </motion.div>
  );
};

export default DreamBanner;
