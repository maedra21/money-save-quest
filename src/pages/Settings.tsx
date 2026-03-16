import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { getSettings, updateSettings, getAllEntries } from "@/lib/storage";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { t, getPreferences, updatePreferences, CURRENCIES, getCurrencySymbol, DREAM_CATEGORIES } from "@/lib/i18n";
import type { Language, CurrencyCode } from "@/lib/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const SettingsPage = () => {
  const settings = getSettings();
  const prefs = getPreferences();
  const [goalAmount, setGoalAmount] = useState(
    settings.savingsGoal?.target?.toString() || ""
  );
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState<Language>(prefs.language);
  const [currency, setCurrency] = useState<CurrencyCode>(prefs.currency);
  const [dreamId, setDreamId] = useState<string | null>(prefs.dreamId || null);
  const [customDream, setCustomDream] = useState(prefs.dreamCustomName || "");
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

  const handleDreamSelect = (id: string) => {
    setDreamId(id);
    if (id !== "other") {
      updatePreferences({ dreamId: id, dreamCustomName: null });
    }
  };

  const handleCustomDreamSave = () => {
    if (customDream.trim()) {
      updatePreferences({ dreamId: "other", dreamCustomName: customDream.trim() });
    }
  };

  const handleClearDream = () => {
    setDreamId(null);
    setCustomDream("");
    updatePreferences({ dreamId: null, dreamCustomName: null });
  };

  const handleResetAllData = () => {
    localStorage.removeItem("did-i-save-today");
    localStorage.removeItem("did-i-save-settings");
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
                {lang === "en" ? "🇺🇸 English" : "🇷🇺 Русский"}
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

        {/* Dream + Goal unified */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold mb-2 text-foreground">{t("settings.dream")}</h2>
          <p className="text-sm text-muted-foreground font-body mb-4">{t("settings.dream.select")}</p>
          <div className="grid grid-cols-2 gap-3">
            {DREAM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleDreamSelect(cat.id)}
                className={`py-3 px-3 rounded-xl font-display font-bold border transition-colors flex items-center gap-2 text-sm ${
                  dreamId === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border"
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span className="truncate">{language === "ru" ? cat.labelRu : cat.labelEn}</span>
              </button>
            ))}
          </div>
          {dreamId === "other" && (
            <div className="flex gap-3 mt-3">
              <input
                type="text"
                value={customDream}
                onChange={(e) => setCustomDream(e.target.value)}
                placeholder={t("settings.dream.custom")}
                className="flex-1 py-3 px-4 rounded-xl bg-secondary text-foreground font-display border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCustomDreamSave}
                className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold"
              >
                ✓
              </button>
            </div>
          )}
          {dreamId && (
            <button
              onClick={handleClearDream}
              className="text-xs text-muted-foreground underline mt-2"
            >
              {t("settings.dream.clear")}
            </button>
          )}

          {/* Goal amount — now part of the dream section */}
          {dreamId && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground font-body mb-2">{t("settings.goal.amount")}</p>
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
          )}
        </div>

        {/* Reset data */}
        <div className="mb-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full py-3 rounded-xl bg-destructive/10 text-destructive font-display font-bold border border-destructive/30 flex items-center justify-center gap-2">
                <Trash2 size={18} />
                {t("settings.reset")}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("settings.reset.title")}</AlertDialogTitle>
                <AlertDialogDescription>{t("settings.reset.desc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t("settings.reset.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* About */}
        <div className="text-center pb-4">
          <p className="text-xs text-muted-foreground font-body">{t("settings.about.name")}</p>
          <p className="text-xs text-muted-foreground font-body">{t("settings.about.local")}</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
