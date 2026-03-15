import { motion } from "framer-motion";
import { t } from "@/lib/i18n";

const QUOTE_KEYS = [
  "quote.biden",
  "quote.penny",
  "quote.art",
  "quote.leak",
  "quote.buffett",
] as const;

type QuoteKey = (typeof QUOTE_KEYS)[number];

const getDailyQuoteKey = (): QuoteKey => {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return QUOTE_KEYS[seed % QUOTE_KEYS.length];
};

const DailyQuote = () => {
  const quoteKey = getDailyQuoteKey();
  const quote = t(quoteKey as any);

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
