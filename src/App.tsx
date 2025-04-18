
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const onboardingCompleted = localStorage.getItem("darcare-onboarded");
    if (onboardingCompleted === "true") {
      setIsOnboarded(true);
    }

    // Simulate splash screen timing
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("darcare-onboarded", "true");
    setIsOnboarded(true);
  };

  const mockLogin = () => {
    setIsAuthenticated(true);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                !isOnboarded ? (
                  <Onboarding onComplete={completeOnboarding} />
                ) : !isAuthenticated ? (
                  <Auth onLogin={mockLogin} />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />
            <Route path="/onboarding" element={<Onboarding onComplete={completeOnboarding} />} />
            <Route path="/auth" element={<Auth onLogin={mockLogin} />} />
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
