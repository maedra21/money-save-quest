import { motion } from "framer-motion";
import { getDreamLabel, getDreamEmoji, t } from "@/lib/i18n";
import { getTotalSaved } from "@/lib/storage";
import { formatCurrency } from "@/lib/i18n";

const DreamBanner = () => {
  const label = getDreamLabel();
  const emoji = getDreamEmoji();
  const total = getTotalSaved();

  if (!label) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xs bg-card rounded-2xl p-4 border border-primary/20 flex items-center gap-3"
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-body">{t("dream.saving.for")}</p>
        <p className="font-display font-bold text-foreground truncate">{label}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-display font-bold text-primary">{formatCurrency(total)}</p>
      </div>
    </motion.div>
  );
};

export default DreamBanner;
