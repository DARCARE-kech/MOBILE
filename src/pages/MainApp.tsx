
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

  // Create routes based on authentication state
  const createAppRoutes = () => {
    const routes = [
      {
        path: "/auth",
        element: user ? <Navigate to="/home" /> : <Auth />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/home",
        element: user ? <Home /> : <Navigate to="/auth" />,
      },
      {
        path: "/explore",
        element: user ? <Explore /> : <Navigate to="/auth" />,
      },
      {
        path: "/explore/recommendations/:id",
        element: user ? <RecommendationDetail /> : <Navigate to="/auth" />,
      },
      {
        path: "/explore/favorites",
        element: user ? <Favorites /> : <Navigate to="/auth" />,
      },
      {
        path: "/services",
        element: user ? <Services /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/:id",
        element: user ? <ServiceDetail /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/requests/:id",
        element: user ? <RequestDetailPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/request/:id",
        element: user ? <RequestDetailPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/request-form",
        element: user ? <ServiceRequestForm /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/space/:id",
        element: user ? <BookSpaceService /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/spaces",
        element: user ? <SpacesListPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/shop",
        element: user ? <ShopService /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/cart",
        element: user ? <CartScreen /> : <Navigate to="/auth" />,
      },
      {
        path: "/notifications",
        element: user ? <Notifications /> : <Navigate to="/auth" />,
      },
      {
        path: "/stays/details",
        element: user ? <StayDetailsPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile",
        element: user ? <Profile /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile/edit",
        element: user ? <EditProfile /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile/help",
        element: user ? <HelpSupportPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile/about",
        element: user ? <AboutPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile/privacy",
        element: user ? <PrivacySecurityPage /> : <Navigate to="/auth" />,
      },
      {
        path: "/profile/change-password",
        element: user ? <ChangePassword /> : <Navigate to="/auth" />,
      },
      {
        path: "/services/laundry",
        element: user ? <ServiceDetail /> : <Navigate to="/auth" />,
      },
      {
        path: "/chatbot",
        element: user ? <Chatbot /> : <Navigate to="/auth" />,
      },
      {
        path: "/chat-history",
        element: user ? <ChatHistory /> : <Navigate to="/auth" />,
      },
      {
        path: "/contact-admin",
        element: user ? <ContactAdmin /> : <Navigate to="/auth" />,
      },
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
        path: "/onboarding",
        element: hasSeenOnboarding ? (
          <Navigate to="/auth" />
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ];

    return routes;
  };

  const router = createBrowserRouter(createAppRoutes());

  if (showSplash) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
};

export default MainApp;
