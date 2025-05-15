import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SplashScreen from "./SplashScreen";
import Onboarding from "./Onboarding";
import Auth from "./Auth";
import Home from "./Home";
import Explore from "./Explore";
import Services from "./Services";
import Notifications from "./Notifications";
import Profile from "./Profile";
import ServiceDetail from "@/components/services/ServiceDetail";
import SpacesListPage from "@/pages/services/SpacesListPage";
import BookSpaceService from "@/pages/services/BookSpaceService";
import ShopService from "@/pages/services/ShopService";
import CartScreen from "@/pages/services/CartScreen";
import RecommendationDetail from "@/pages/explore/RecommendationDetail";
import Chatbot from "@/pages/Chatbot";
import ChatHistory from "@/pages/ChatHistory";
import ContactAdmin from "@/pages/ContactAdmin";
import Favorites from "@/pages/explore/Favorites";
import RequestDetailPage from "@/pages/services/RequestDetailPage";
import ServiceRequestForm from "@/pages/services/ServiceRequestForm";
import StayDetailsPage from "@/pages/stays/StayDetailsPage";
import EditProfile from "@/pages/profile/EditProfile";
import HelpSupportPage from "@/pages/profile/HelpSupportPage";
import AboutPage from "@/pages/profile/AboutPage";
import ChangePassword from "@/pages/profile/ChangePassword";
import PrivacySecurityPage from "@/pages/profile/PrivacySecurityPage";
import ForgotPassword from "./ForgotPassword";

const MainApp: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem("hasSeenOnboarding") === "true";
  });
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
  };

  // Higher-order component to protect routes that require authentication
  const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    return user ? element : <Navigate to="/auth" />;
  };

  // Create routes based on authentication state
  const createAppRoutes = () => {
    // Public routes - accessible without authentication
    const publicRoutes = [
      {
        path: "/auth",
        element: user ? <Navigate to="/home" /> : <Auth />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/onboarding",
        element: hasSeenOnboarding ? (
          <Navigate to="/auth" />
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        ),
      },
    ];

    // Protected routes - require authentication
    const protectedRoutes = [
      // Home routes
      {
        path: "/home",
        element: <ProtectedRoute element={<Home />} />,
      },
      
      // Explore routes
      {
        path: "/explore",
        element: <ProtectedRoute element={<Explore />} />,
      },
      {
        path: "/explore/recommendations/:id",
        element: <ProtectedRoute element={<RecommendationDetail />} />,
      },
      {
        path: "/explore/favorites",
        element: <ProtectedRoute element={<Favorites />} />,
      },
      
      // Services routes
      {
        path: "/services",
        element: <ProtectedRoute element={<Services />} />,
      },
      {
        path: "/services/:id",
        element: <ProtectedRoute element={<ServiceDetail />} />,
      },
      {
        path: "/services/requests/:id",
        element: <ProtectedRoute element={<RequestDetailPage />} />,
      },
      {
        path: "/services/request/:id",
        element: <ProtectedRoute element={<RequestDetailPage />} />,
      },
      {
        path: "/services/request-form",
        element: <ProtectedRoute element={<ServiceRequestForm serviceType="general" />} />,
      },
      {
        path: "/services/space/:id",
        element: <ProtectedRoute element={<BookSpaceService />} />,
      },
      {
        path: "/services/spaces",
        element: <ProtectedRoute element={<SpacesListPage />} />,
      },
      {
        path: "/services/shop",
        element: <ProtectedRoute element={<ShopService />} />,
      },
      {
        path: "/services/cart",
        element: <ProtectedRoute element={<CartScreen />} />,
      },
      
      // Stays routes
      {
        path: "/stays/details",
        element: <ProtectedRoute element={<StayDetailsPage />} />,
      },
      
      // Notifications
      {
        path: "/notifications",
        element: <ProtectedRoute element={<Notifications />} />,
      },
      
      // Profile routes
      {
        path: "/profile",
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        path: "/profile/edit",
        element: <ProtectedRoute element={<EditProfile />} />,
      },
      {
        path: "/profile/help",
        element: <ProtectedRoute element={<HelpSupportPage />} />,
      },
      {
        path: "/profile/about",
        element: <ProtectedRoute element={<AboutPage />} />,
      },
      {
        path: "/profile/privacy",
        element: <ProtectedRoute element={<PrivacySecurityPage />} />,
      },
      {
        path: "/profile/change-password",
        element: <ProtectedRoute element={<ChangePassword />} />,
      },
      
      // Chat routes
      {
        path: "/chatbot",
        element: <ProtectedRoute element={<Chatbot />} />,
      },
      {
        path: "/chat-history",
        element: <ProtectedRoute element={<ChatHistory />} />,
      },
      {
        path: "/contact-admin",
        element: <ProtectedRoute element={<ContactAdmin />} />,
      },
    ];

    // Redirection routes
    const redirectRoutes = [
      {
        path: "/",
        element: user ? (
          <Navigate to="/home" />
        ) : hasSeenOnboarding ? (
          <Navigate to="/auth" />
        ) : (
          <Navigate to="/onboarding" />
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ];

    return [...publicRoutes, ...protectedRoutes, ...redirectRoutes];
  };

  const router = createBrowserRouter(createAppRoutes());

  if (showSplash) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
};

export default MainApp;
