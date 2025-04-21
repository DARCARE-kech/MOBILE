
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
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Auth route that redirects to home if logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
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

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
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
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      
      {/* Protected routes */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
      <Route path="/services/spaces" element={<ProtectedRoute><SpacesListPage /></ProtectedRoute>} />
      <Route path="/services/space/:id?" element={<ProtectedRoute><BookSpaceService /></ProtectedRoute>} />
      <Route path="/services/:id" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
      <Route path="/services/requests/:id" element={<ProtectedRoute><RequestDetailPage /></ProtectedRoute>} />
      <Route path="/services/cart" element={<ProtectedRoute><CartScreen /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      <Route path="/chat-history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
      <Route path="/contact-admin" element={<ProtectedRoute><ContactAdmin /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/profile/privacy" element={<ProtectedRoute><PrivacySecurityPage /></ProtectedRoute>} />
      <Route path="/profile/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/profile/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
      <Route path="/profile/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
      <Route path="/explore/recommendations/:id" element={<ProtectedRoute><RecommendationDetail /></ProtectedRoute>} />
      <Route path="/explore/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/stays/details" element={<ProtectedRoute><StayDetailsPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
