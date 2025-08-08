import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanelOverview from '@/components/AdminPanelOverview';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/pages/AdminPanel';

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

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin-overview" element={<AdminPanelOverview />} />
      <Route path="/admin" element={<AdminPanelWrapper />} />
    </Routes>
  );
};

export default AdminRoutes;
