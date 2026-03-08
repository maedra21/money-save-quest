import { motion } from "framer-motion";

interface SaveButtonsProps {
  onAnswer: (saved: boolean) => void;
  disabled: boolean;
}

const SaveButtons = ({ onAnswer, disabled }: SaveButtonsProps) => {
  return (
    <div className="flex gap-6 w-full max-w-xs">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onAnswer(true)}
        disabled={disabled}
        className="flex-1 py-6 rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-bold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ✅ YES
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onAnswer(false)}
        disabled={disabled}
        className="flex-1 py-6 rounded-2xl bg-secondary text-destructive font-display text-2xl font-bold shadow-lg border border-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ❌ NO
      </motion.button>
    </div>
  );
};

export default SaveButtons;
