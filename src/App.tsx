import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Fatwa from "./pages/Fatwa";
import Fiqh from "./pages/Fiqh";
import Language from "./pages/Language";
import Circle from "./pages/Circle";
import { CircleKnowledge } from "./pages/admin/CircleKnowledge";
import AdminConfig from "./pages/AdminConfig";
import DocumentUpload from "./pages/DocumentUpload";
import Login from "./pages/auth/Login";
import AppShell from "./components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import MediaPage from "./pages/MediaPage";
import EventsPage from "./pages/EventsPage";
import ShopPage from "./pages/ShopPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/fatwa" element={<Fatwa />} />
                <Route path="/fiqh" element={<Fiqh />} />
                <Route path="/language" element={<Language />} />
                <Route
                  path="/circle"
                  element={
                    <ProtectedRoute adminOnly>
                      <CircleKnowledge />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <ChatInterface />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/config"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminConfig />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute adminOnly>
                      <DocumentUpload />
                    </ProtectedRoute>
                  }
                />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/shop" element={<ShopPage />} />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
