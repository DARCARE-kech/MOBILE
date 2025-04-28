
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
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
import ContactAdmin from "@/pages/ContactAdmin";
import Favorites from "@/pages/explore/Favorites";
import RequestDetailPage from "@/pages/services/RequestDetailPage";
import StayDetailsPage from "@/pages/stays/StayDetailsPage"
import EditProfile from "@/pages/profile/EditProfile"
import HelpSupportPage from "@/pages/profile/HelpSupportPage"
import AboutPage from "@/pages/profile/AboutPage"
import ChangePassword from "@/pages/profile/ChangePassword"
import PrivacySecurityPage from "@/pages/profile/PrivacySecurityPage"

// Create a client
const queryClient = new QueryClient();

// Create router with routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/explore/recommendations/:id",
    element: <RecommendationDetail />,
  },
  {
    path: "/explore/favorites",
    element: <Favorites />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/services/:id",
    element: <ServiceDetail />,
  },
  {
    path: "/services/request/:id",
    element: <RequestDetailPage />,
  },
  {
    path: "/services/space/:id",
    element: <BookSpaceService />,
  },
  {
    path: "/services/spaces",
    element: <SpacesListPage />,
  },
  {
    path: "/services/shop",
    element: <ShopService />,
  },
  {
    path: "/services/cart",
    element: <CartScreen />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/stays/details",
    element: <StayDetailsPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
   {
    path: "/profile/edit",
    element: < EditProfile />,
  },
  {
    path: "/profile/help",
    element: < HelpSupportPage />,
  },
  {
    path: "/profile/about",
    element: < AboutPage />,
  },
  {
    path: "/profile/privacy",
    element: < PrivacySecurityPage />,
  },
  {
    path: "/profile/change-password",
    element: < ChangePassword />,
  },
  {
    path: "/services/laundry",
    element: <ServiceDetail />,
  },
  {
    path: "/chatbot",
    element: <Chatbot />,
  },
  {
    path: "/contact-admin",
    element: <ContactAdmin />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
