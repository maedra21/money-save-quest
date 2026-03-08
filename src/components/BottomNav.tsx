import { Home, CalendarDays, Trophy, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: "/", icon: Home, label: "Today" },
    { path: "/history", icon: CalendarDays, label: "History" },
    { path: "/achievements", icon: Trophy, label: "Badges" },
    { path: "/settings", icon: Settings, label: "Settings" },
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
            <span className="text-[10px] font-body">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
