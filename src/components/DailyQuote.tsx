import { motion } from "framer-motion";

const QUOTES = [
  "Don't tell me what you value, show me your budget. — Joe Biden",
  "A penny saved is a penny earned. — Benjamin Franklin",
  "The art is not in making money, but in keeping it. — Proverb",
  "Beware of little expenses. A small leak will sink a great ship. — Benjamin Franklin",
  "Do not save what is left after spending, but spend what is left after saving. — Warren Buffett",
];

const getDailyQuote = () => {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return QUOTES[seed % QUOTES.length];
};

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
