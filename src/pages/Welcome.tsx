import { useState } from "react";
import { motion } from "framer-motion";
import { CURRENCIES, CurrencyCode, Language, updatePreferences, getPreferences } from "@/lib/i18n";

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome = ({ onComplete }: WelcomeProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");

  const handleStart = () => {
    updatePreferences({
      currency: selectedCurrency,
      language: selectedLanguage,
      onboarded: true,
    });
    onComplete();
  };

  const title = selectedLanguage === "ru" ? "Добро пожаловать! 👋" : "Welcome! 👋";
  const subtitle = selectedLanguage === "ru" ? "Выберите валюту и язык" : "Choose your currency & language";
  const startText = selectedLanguage === "ru" ? "Начать" : "Get Started";

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 gap-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-3xl font-display font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground font-body">{subtitle}</p>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xs"
      >
        <p className="text-sm font-display font-semibold mb-3 text-muted-foreground">
          {selectedLanguage === "ru" ? "Язык" : "Language"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["en", "ru"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`py-3 rounded-xl font-display font-bold text-lg border transition-colors ${
                selectedLanguage === lang
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border"
              }`}
            >
              {lang === "en" ? "🇺🇸 English" : "🇷🇺 Русский"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Currency */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xs"
      >
        <p className="text-sm font-display font-semibold mb-3 text-muted-foreground">
          {selectedLanguage === "ru" ? "Валюта" : "Currency"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CURRENCIES.map((cur) => (
            <button
              key={cur.code}
              onClick={() => setSelectedCurrency(cur.code)}
              className={`py-4 rounded-xl flex flex-col items-center gap-1 border transition-colors ${
                selectedCurrency === cur.code
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-foreground border-border"
              }`}
            >
              <span className="text-2xl">{cur.emoji}</span>
              <span className="font-display font-bold">{cur.label}</span>
              <span className="text-sm opacity-70">({cur.symbol})</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="w-full max-w-xs py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-xl"
      >
        {startText}
      </motion.button>
    </div>
  );
};

export default Welcome;
