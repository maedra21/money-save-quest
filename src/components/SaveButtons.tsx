import { useState } from "react";
import { motion } from "framer-motion";
import { t, getCurrencySymbol, formatCurrency } from "@/lib/i18n";
import type { SavingItem } from "@/lib/storage";
import { Plus, AlertCircle } from "lucide-react";

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
  addingMore?: boolean;
  onCancel?: () => void;
}

const SaveButtons = ({ onAnswer, disabled, addingMore, onCancel }: SaveButtonsProps) => {
  const [step, setStep] = useState<"buttons" | "amount" | "category" | "review">(addingMore ? "amount" : "buttons");
  const [amount, setAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState<number | undefined>();
  const [items, setItems] = useState<SavingItem[]>([]);
  const [amountError, setAmountError] = useState(false);
  const symbol = getCurrencySymbol();

  const handleYes = () => {
    setStep("amount");
  };

  const validateAmount = (val: string): boolean => {
    const clean = val.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) return false;
    const num = parseFloat(clean);
    return !isNaN(num) && num > 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && !/^\d*\.?\d*$/.test(val)) return;
    setAmount(val);
    setAmountError(false);
  };

  const handleSubmitAmount = () => {
    if (!amount || !validateAmount(amount)) {
      setAmountError(true);
      return;
    }
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
    setAmountError(false);
  };

  const handleSkipCategory = () => {
    const newItem: SavingItem = { amount: currentAmount };
    const newItems = [...items, newItem];
    setItems(newItems);
    setStep("review");
    setAmount("");
    setCurrentAmount(undefined);
    setAmountError(false);
  };

  const handleAddMore = () => {
    setStep("amount");
  };

  const handleFinish = () => {
    onAnswer(true, items);
    resetState();
  };

  const handleCancel = () => {
    resetState();
    onCancel?.();
  };

  const resetState = () => {
    setStep("buttons");
    setAmount("");
    setCurrentAmount(undefined);
    setItems([]);
    setAmountError(false);
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
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="text-sm text-muted-foreground underline mt-0.5"
        >
          {t("cancel")}
        </motion.button>
      </motion.div>
    );
  }

  if (step === "amount") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <p className="text-lg font-display font-semibold text-foreground">{t("amount.question")}</p>
        <p className="text-xs text-muted-foreground font-body">{t("amount.hint")}</p>
        {items.length > 0 && (
          <p className="text-xs text-muted-foreground font-body">
            {t("review.itemCount", items.length)}
          </p>
        )}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-display text-muted-foreground">{symbol}</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            autoFocus
            className={`w-full py-4 pl-10 pr-4 rounded-xl bg-secondary text-foreground text-2xl font-display text-center border ${amountError ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"} focus:outline-none focus:ring-2`}
          />
        </div>
        {amountError && (
          <div className="flex items-center gap-1.5 text-destructive text-sm">
            <AlertCircle size={14} />
            <span className="font-body">{t("amount.required")}</span>
          </div>
        )}
        <div className="flex gap-3 w-full mt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmitAmount}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg"
          >
            {t("amount.save")}
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="text-sm text-muted-foreground underline mt-1"
        >
          {t("cancel")}
        </motion.button>
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
