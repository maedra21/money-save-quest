import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { getSettings, updateSettings } from "@/lib/storage";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { t, getPreferences, updatePreferences, CURRENCIES, getCurrencySymbol } from "@/lib/i18n";
import type { Language, CurrencyCode } from "@/lib/i18n";

const SettingsPage = () => {
  const settings = getSettings();
  const prefs = getPreferences();
  const [goalAmount, setGoalAmount] = useState(
    settings.savingsGoal?.target?.toString() || ""
  );
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState<Language>(prefs.language);
  const [currency, setCurrency] = useState<CurrencyCode>(prefs.currency);
  const isPremium = settings.isPremium;
  const symbol = getCurrencySymbol();

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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    updatePreferences({ language: lang });
    window.location.reload();
  };

  const handleCurrencyChange = (code: CurrencyCode) => {
    setCurrency(code);
    updatePreferences({ currency: code });
    window.location.reload();
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
      <div className="flex-1 px-6 pt-10 pb-6 overflow-y-auto">
        <h1 className="text-2xl font-display font-bold mb-8">{t("settings.title")}</h1>

        {/* Language */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">{t("settings.language")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {(["en", "ru"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`py-3 rounded-xl font-display font-bold border transition-colors ${
                  language === lang
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border"
                }`}
              >
                {lang === "en" ? "🇬🇧 English" : "🇷🇺 Русский"}
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">{t("settings.currency")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {CURRENCIES.map((cur) => (
              <button
                key={cur.code}
                onClick={() => handleCurrencyChange(cur.code)}
                className={`py-3 rounded-xl font-display font-bold border transition-colors flex items-center justify-center gap-2 ${
                  currency === cur.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border"
                }`}
              >
                <span>{cur.emoji}</span>
                <span>{cur.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Savings Goal */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">{t("settings.goal")}</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-display">{symbol}</span>
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
              {saved ? "✓" : t("settings.set")}
            </button>
          </div>
          {settings.savingsGoal && (
            <button
              onClick={handleClearGoal}
              className="text-xs text-muted-foreground underline mt-2"
            >
              {t("settings.clear")}
            </button>
          )}
        </div>

        {/* Premium */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-4 text-foreground">{t("settings.premium")}</h2>
          <motion.div
            className={`rounded-xl p-5 border ${
              isPremium ? "bg-primary/10 border-primary/30" : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Crown size={24} className="text-primary" />
              <div>
                <p className="font-display font-bold text-foreground">
                  {isPremium ? t("settings.premium.active") : t("settings.premium.go")}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {isPremium ? t("settings.premium.thanks") : t("settings.premium.price")}
                </p>
              </div>
            </div>
            {isPremium ? (
              <button
                onClick={handleDowngrade}
                className="w-full py-2 rounded-lg bg-secondary text-muted-foreground font-body text-sm border border-border"
              >
                {t("settings.premium.downgrade")}
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold"
              >
                {t("settings.premium.upgrade")}
              </button>
            )}
          </motion.div>
        </div>

        {/* About */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-body">{t("settings.about.name")}</p>
          <p className="text-xs text-muted-foreground font-body">{t("settings.about.local")}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
