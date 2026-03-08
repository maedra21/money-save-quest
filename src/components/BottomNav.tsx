import { Home, CalendarDays } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: "/", icon: Home, label: "Today" },
    { path: "/history", icon: CalendarDays, label: "History" },
  ];

  return (
    <nav className="flex justify-around items-center py-3 bg-card border-t border-border">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 px-6 py-1 rounded-lg transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon size={22} />
            <span className="text-xs font-body">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
