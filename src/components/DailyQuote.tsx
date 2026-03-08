import { motion } from "framer-motion";
import { getDailyQuote } from "@/lib/storage";

const DailyQuote = () => {
  const quote = getDailyQuote();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-xs px-4"
    >
      <p className="text-xs text-muted-foreground font-body text-center italic leading-relaxed">
        "{quote}"
      </p>
    </motion.div>
  );
};

export default DailyQuote;
