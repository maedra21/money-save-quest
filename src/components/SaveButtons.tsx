import { useState } from "react";
import { motion } from "framer-motion";
import { t, getCurrencySymbol, formatCurrency } from "@/lib/i18n";
import type { SavingItem } from "@/lib/storage";
import { Plus } from "lucide-react";

const CATEGORIES = [
  "category.food",
  "category.coffee",
  "category.transport",
  "category.clothes",
  "category.entertainment",
  "category.shopping",
  "category.other",
] as const;

interface SaveButtonsProps {
  onAnswer: (saved: boolean, items?: SavingItem[]) => void;
  disabled: boolean;
}

const SaveButtons = ({ onAnswer, disabled }: SaveButtonsProps) => {
  const [step, setStep] = useState<"buttons" | "amount" | "category" | "review">("buttons");
  const [amount, setAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState<number | undefined>();
  const [items, setItems] = useState<SavingItem[]>([]);
  const symbol = getCurrencySymbol();

  const handleYes = () => {
    setStep("amount");
  };

  const handleSubmitAmount = () => {
    const num = parseFloat(amount);
    setCurrentAmount(num > 0 ? num : undefined);
    setStep("category");
  };

  const handleSkipAmount = () => {
    setCurrentAmount(undefined);
    setStep("category");
  };

  const handleSelectCategory = (cat: string) => {
    const newItem: SavingItem = { amount: currentAmount, category: cat };
    const newItems = [...items, newItem];
    setItems(newItems);
    setStep("review");
    setAmount("");
    setCurrentAmount(undefined);
  };

  const handleSkipCategory = () => {
    const newItem: SavingItem = { amount: currentAmount };
    const newItems = [...items, newItem];
    setItems(newItems);
    setStep("review");
    setAmount("");
    setCurrentAmount(undefined);
  };

  const handleAddMore = () => {
    setStep("amount");
  };

  const handleFinish = () => {
    onAnswer(true, items);
    resetState();
  };

  const resetState = () => {
    setStep("buttons");
    setAmount("");
    setCurrentAmount(undefined);
    setItems([]);
  };

  if (step === "review") {
    const total = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <p className="text-lg font-display font-semibold text-foreground">
          {t("review.title")}
        </p>
        <div className="w-full space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-secondary rounded-xl px-4 py-2.5 border border-border">
              <span className="text-sm font-body text-foreground">{item.category || "—"}</span>
              <span className="text-sm font-display font-bold text-primary">
                {item.amount ? formatCurrency(item.amount) : "—"}
              </span>
            </div>
          ))}
        </div>
        {total > 0 && (
          <p className="text-lg font-display font-bold text-primary">
            {t("review.total")}: {formatCurrency(total)}
          </p>
        )}
        <div className="flex gap-3 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFinish}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg"
          >
            {t("review.done")}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddMore}
            className="py-3 px-4 rounded-xl bg-secondary text-foreground font-body text-sm border border-border flex items-center gap-1.5"
          >
            <Plus size={16} />
            {t("review.addMore")}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (step === "category") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <p className="text-lg font-display font-semibold text-foreground">{t("category.question")}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((catKey) => (
            <motion.button
              key={catKey}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectCategory(t(catKey))}
              className="px-4 py-2.5 rounded-xl bg-secondary text-foreground font-body text-sm border border-border hover:bg-accent transition-colors"
            >
              {t(catKey)}
            </motion.button>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSkipCategory}
          className="text-sm text-muted-foreground underline mt-1"
        >
          {t("category.skip")}
        </motion.button>
      </motion.div>
    );
  }

  if (step === "amount") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <p className="text-lg font-display font-semibold text-foreground">{t("amount.question")}</p>
        {items.length > 0 && (
          <p className="text-xs text-muted-foreground font-body">
            {t("review.itemCount", items.length)}
          </p>
        )}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-display text-muted-foreground">{symbol}</span>
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
            {t("amount.save")}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipAmount}
            className="py-3 px-5 rounded-xl bg-secondary text-muted-foreground font-body text-sm border border-border"
          >
            {t("amount.skip")}
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
        {t("btn.yes")}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onAnswer(false)}
        disabled={disabled}
        className="flex-1 py-6 rounded-2xl bg-secondary text-destructive font-display text-2xl font-bold shadow-lg border border-border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {t("btn.no")}
      </motion.button>
    </div>
  );
};

export default SaveButtons;
