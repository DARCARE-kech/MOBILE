
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

// Import pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Explore from "@/pages/Explore";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Notifications from "@/pages/Notifications";
import RequestDetailPage from "@/pages/services/RequestDetailPage";
import SpaceReservationPage from "@/pages/spaces/SpaceReservationPage";
import Chatbot from "@/pages/Chatbot";
import ContactAdmin from "@/pages/ContactAdmin";

// Create ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // This should be implemented with proper auth logic
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  const handleOnboardingComplete = () => {
    // Handle onboarding completion
    console.log('Onboarding completed');
  };

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
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
                  
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
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/chatbot" element={
                    <ProtectedRoute>
                      <Chatbot />
                    </ProtectedRoute>
                  } />
                  <Route path="/contact-admin" element={
                    <ProtectedRoute>
                      <ContactAdmin />
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
