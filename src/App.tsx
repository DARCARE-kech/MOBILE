
import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Services from "@/pages/Services";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";
import ServiceDetail from "@/components/services/ServiceDetail";
import SpacesListPage from "@/pages/services/SpacesListPage";
import BookSpaceService from "@/pages/services/BookSpaceService";
import ShopService from "@/pages/services/ShopService";
import CartScreen from "@/pages/services/CartScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "@/pages/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RecommendationDetail from "@/pages/explore/RecommendationDetail";
import Chatbot from "@/pages/Chatbot";
import ChatHistory from "@/pages/ChatHistory";
import ContactAdmin from "@/pages/ContactAdmin";
import Favorites from "@/pages/explore/Favorites";
import RequestDetailPage from "@/pages/services/RequestDetailPage";
import ServiceRequestForm from "@/pages/services/ServiceRequestForm";
import StayDetailsPage from "@/pages/stays/StayDetailsPage"
import EditProfile from "@/pages/profile/EditProfile"
import HelpSupportPage from "@/pages/profile/HelpSupportPage"
import AboutPage from "@/pages/profile/AboutPage"
import ChangePassword from "@/pages/profile/ChangePassword"
import PrivacySecurityPage from "@/pages/profile/PrivacySecurityPage"
import { ThemeProvider } from "@/contexts/ThemeContext";
import SplashScreen from "@/pages/SplashScreen";
import Onboarding from "@/pages/Onboarding";
import ForgotPassword from "@/pages/ForgotPassword";
import MainApp from "@/pages/MainApp";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <MainApp />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
