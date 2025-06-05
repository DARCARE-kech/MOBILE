
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

// Import pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Explore from "@/pages/Explore";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Splash from "@/pages/Splash";
import NotificationsPage from "@/pages/NotificationsPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import RequestDetailPage from "@/pages/services/RequestDetailPage";
import ServiceDetailPage from "@/pages/services/ServiceDetailPage";
import SpaceReservationPage from "@/pages/spaces/SpaceReservationPage";
import ChatbotPage from "@/pages/ChatbotPage";
import ContactAdminPage from "@/pages/ContactAdminPage";
import ShopPage from "@/pages/ShopPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/splash" element={<Splash />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  } />
                  <Route path="/services" element={
                    <ProtectedRoute>
                      <Services />
                    </ProtectedRoute>
                  } />
                  <Route path="/services/:id" element={
                    <ProtectedRoute>
                      <ServiceDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/services/requests/:id" element={
                    <ProtectedRoute>
                      <RequestDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/spaces/:id" element={
                    <ProtectedRoute>
                      <SpaceReservationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/explore" element={
                    <ProtectedRoute>
                      <Explore />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/chatbot" element={
                    <ProtectedRoute>
                      <ChatbotPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/contact-admin" element={
                    <ProtectedRoute>
                      <ContactAdminPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <ShopPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

export default App;
