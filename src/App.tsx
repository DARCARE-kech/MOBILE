
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import StayDetailsPage from "./pages/stays/StayDetailsPage";
import RequestDetailPage from "./pages/services/RequestDetailPage";
import CartScreen from "./pages/services/CartScreen";
import ChatHistory from "./pages/ChatHistory";
import ContactAdmin from "./pages/ContactAdmin";
import EditProfile from "./pages/profile/EditProfile";
import PrivacySecurityPage from "./pages/profile/PrivacySecurityPage";
import HelpSupportPage from "./pages/profile/HelpSupportPage";
import AboutPage from "./pages/profile/AboutPage";
import ChangePassword from "./pages/profile/ChangePassword";
import "./i18n"; // Ensure i18n is initialized before any components

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
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
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
                <Route path="/services/requests/:id" element={<RequestDetailPage />} />
                <Route path="/services/cart" element={<CartScreen />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/chat-history" element={<ChatHistory />} />
                <Route path="/contact-admin" element={<ContactAdmin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/privacy" element={<PrivacySecurityPage />} />
                <Route path="/profile/change-password" element={<ChangePassword />} />
                <Route path="/profile/help" element={<HelpSupportPage />} />
                <Route path="/profile/about" element={<AboutPage />} />
                <Route path="/explore/recommendations/:id" element={<RecommendationDetail />} />
                <Route path="/explore/favorites" element={<FavoritesPage />} />
                <Route path="/stays/details" element={<StayDetailsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
