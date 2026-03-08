import { getSettings } from "@/lib/storage";

const AdBanner = () => {
  const settings = getSettings();
  if (settings.isPremium) return null;

  return (
    <div className="w-full py-3 flex items-center justify-center bg-secondary/50 border-t border-border">
      <p className="text-xs text-muted-foreground font-body">Ad Space — AdMob Banner</p>
    </div>
  );
};

export default AdBanner;
