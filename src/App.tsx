import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Fatwa from "./pages/Fatwa";
import Fiqh from "./pages/Fiqh";
import Language from "./pages/Language";
import Circle from "./pages/Circle";
import AdminConfig from "./pages/AdminConfig";
import DocumentUpload from "./pages/DocumentUpload";
import AppShell from "./components/layout/AppShell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fatwa" element={<Fatwa />} />
            <Route path="/fiqh" element={<Fiqh />} />
            <Route path="/language" element={<Language />} />
            <Route path="/circle" element={<Circle />} />
            <Route path="/admin" element={<AdminConfig />} />
            <Route path="/documents" element={<DocumentUpload />} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
