import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminPanelTest from "./components/AdminPanelTest";
import AdminPanelOverview from "./components/AdminPanelOverview";
import { useState } from "react";

const queryClient = new QueryClient();

const AdminPanelWrapper = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (username: string) => {
    setAdminUsername(username);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    navigate('/admin');
  };

  const handleBackToDashboard = () => {
    navigate('/');
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

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin-overview" element={<AdminPanelOverview />} />
              <Route path="/admin" element={<AdminPanelWrapper />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
