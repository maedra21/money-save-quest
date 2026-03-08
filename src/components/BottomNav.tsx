import { Home, CalendarDays, Trophy, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "@/lib/i18n";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: "/", icon: Home, labelKey: "nav.today" as const },
    { path: "/history", icon: CalendarDays, labelKey: "nav.history" as const },
    { path: "/achievements", icon: Trophy, labelKey: "nav.badges" as const },
    { path: "/settings", icon: Settings, labelKey: "nav.settings" as const },
  ];

  return (
    <nav className="flex justify-around items-center py-3 bg-card border-t border-border">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-body">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
