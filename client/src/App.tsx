import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/chat";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import PractitionersMap from "@/pages/practitioners-map";
import UserGuide from "@/pages/user-guide";
import Subscribe from "@/pages/subscribe";
import AnnouncementBanner from "@/components/AnnouncementBanner";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/practitioners-map" component={PractitionersMap} />
      <Route path="/user-guide" component={UserGuide} />
      <Route path="/subscribe" component={Subscribe} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <AnnouncementBanner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
