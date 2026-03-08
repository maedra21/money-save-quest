import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Achievements from "./pages/Achievements";
import SettingsPage from "./pages/Settings";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import { getPreferences } from "./lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  const [onboarded, setOnboarded] = useState(getPreferences().onboarded);

  if (!onboarded) {
    return (
      <TooltipProvider>
        <Welcome onComplete={() => setOnboarded(true)} />
      </TooltipProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
