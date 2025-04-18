import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Services from "./pages/Services";
import Explore from "./pages/Explore";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import ServiceDetail from "@/components/services/ServiceDetail";
import BookSpaceService from "@/pages/services/BookSpaceService";
import SpacesListPage from "@/pages/services/SpacesListPage";
import RecommendationDetail from "./pages/explore/RecommendationDetail";
import FavoritesPage from "./pages/explore/Favorites";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("darcare-onboarded");
    if (onboardingCompleted === "true") {
      setIsOnboarded(true);
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("darcare-onboarded", "true");
    setIsOnboarded(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  !isOnboarded ? (
                    <Onboarding onComplete={completeOnboarding} />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
              <Route path="/onboarding" element={<Onboarding onComplete={completeOnboarding} />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/spaces" element={<SpacesListPage />} />
              <Route path="/services/space/:id?" element={<BookSpaceService />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/explore/recommendations/:id" element={<RecommendationDetail />} />
              <Route path="/explore/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
