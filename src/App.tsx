import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminPanelOverview from "./components/AdminPanelOverview";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Component to check if current route is admin
const useIsAdminRoute = () => {
  const location = useLocation();
  return location.pathname.startsWith('/admin');
};

const AdminPanelWrapper = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  const handleAdminLogin = (username: string) => {
    setAdminUsername(username);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUsername('');
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  if (isAdminLoggedIn) {
    return (
      <AdminPanel 
        username={adminUsername} 
        onLogout={handleAdminLogout}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  } else {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }
};

// Main app content with conditional AuthProvider
const AppContent = () => {
  const isAdminRoute = useIsAdminRoute();

  if (isAdminRoute) {
    // Admin routes without AuthProvider to avoid Appwrite errors
    return (
      <Routes>
        <Route path="/admin-overview" element={<AdminPanelOverview />} />
        <Route path="/admin" element={<AdminPanelWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else {
    // Regular routes with AuthProvider
    return (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    );
  }
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
