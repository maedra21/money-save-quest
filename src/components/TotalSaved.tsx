import { motion } from "framer-motion";
import { getTotalSaved } from "@/lib/storage";
import { t, formatCurrency } from "@/lib/i18n";

const TotalSaved = () => {
  const total = getTotalSaved();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xs bg-card rounded-2xl p-4 border border-border flex items-center justify-between"
    >
      <span className="text-sm font-body text-muted-foreground">{t("history.total")}</span>
      <span className="text-xl font-display font-bold text-primary">
        {formatCurrency(total)}
      </span>
    </motion.div>
  );
};

export default TotalSaved;
