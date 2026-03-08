import { useState } from "react";
import { motion } from "framer-motion";

interface SaveButtonsProps {
  onAnswer: (saved: boolean, amount?: number) => void;
  disabled: boolean;
}

const SaveButtons = ({ onAnswer, disabled }: SaveButtonsProps) => {
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [amount, setAmount] = useState("");

  const handleYes = () => {
    setShowAmountInput(true);
  };

  const handleSubmitAmount = () => {
    const num = parseFloat(amount);
    onAnswer(true, num > 0 ? num : undefined);
    setShowAmountInput(false);
    setAmount("");
  };

  const handleSkipAmount = () => {
    onAnswer(true);
    setShowAmountInput(false);
    setAmount("");
  };

  if (showAmountInput) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <p className="text-lg font-display font-semibold text-foreground">How much did you save?</p>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-display text-muted-foreground">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            autoFocus
            className="w-full py-4 pl-10 pr-4 rounded-xl bg-secondary text-foreground text-2xl font-display text-center border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-3 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitAmount}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg"
          >
            Save ✅
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipAmount}
            className="py-3 px-5 rounded-xl bg-secondary text-muted-foreground font-body text-sm border border-border"
          >
            Skip
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex gap-6 w-full max-w-xs">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleYes}
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
