import { getSettings } from "@/lib/storage";
import { t } from "@/lib/i18n";

const AdBanner = () => {
  const settings = getSettings();
  if (settings.isPremium) return null;

  return (
    <div className="w-full py-3 flex items-center justify-center bg-secondary/50 border-t border-border">
      <p className="text-xs text-muted-foreground font-body">{t("ad.text")}</p>
    </div>
  );
};

export default AdBanner;
