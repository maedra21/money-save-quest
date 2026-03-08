import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { getSettings, updateSettings } from "@/lib/storage";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const SettingsPage = () => {
  const settings = getSettings();
  const [goalAmount, setGoalAmount] = useState(
    settings.savingsGoal?.target?.toString() || ""
  );
  const [saved, setSaved] = useState(false);
  const isPremium = settings.isPremium;

  const handleSaveGoal = () => {
    const num = parseFloat(goalAmount);
    if (num > 0) {
      updateSettings({
        savingsGoal: {
          target: num,
          startDate: settings.savingsGoal?.startDate || format(new Date(), "yyyy-MM-dd"),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClearGoal = () => {
    updateSettings({ savingsGoal: null });
    setGoalAmount("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpgrade = () => {
    updateSettings({ isPremium: true });
    window.location.reload();
  };

  const handleDowngrade = () => {
    updateSettings({ isPremium: false });
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 px-6 pt-10 pb-6">
        <h1 className="text-2xl font-display font-bold mb-8">Settings</h1>

        {/* Savings Goal */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">Savings Goal</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-display">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="100"
                className="w-full py-3 pl-8 pr-4 rounded-xl bg-secondary text-foreground font-display border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold"
            >
              {saved ? "✓" : "Set"}
            </button>
          </div>
          {settings.savingsGoal && (
            <button
              onClick={handleClearGoal}
              className="text-xs text-muted-foreground underline mt-2"
            >
              Clear goal
            </button>
          )}
        </div>

        {/* Premium */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">Premium</h2>
          <motion.div
            className={`rounded-xl p-5 border ${
              isPremium ? "bg-primary/10 border-primary/30" : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Crown size={24} className="text-primary" />
              <div>
                <p className="font-display font-bold text-foreground">
                  {isPremium ? "Premium Active" : "Go Premium"}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {isPremium ? "Ads removed. Thank you!" : "Remove ads for $0.99"}
                </p>
              </div>
            </div>
            {isPremium ? (
              <button
                onClick={handleDowngrade}
                className="w-full py-2 rounded-lg bg-secondary text-muted-foreground font-body text-sm border border-border"
              >
                Restore Ads (Downgrade)
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold"
              >
                Upgrade — $0.99
              </button>
            )}
          </motion.div>
        </div>

        {/* About */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-body">Did I Save Today? v1.0</p>
          <p className="text-xs text-muted-foreground font-body">Data saved locally on your device</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
