import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Regular app routes - wrapped with AuthProvider */}
      <Route 
        path="/" 
        element={
          <AuthProvider>
            <Index />
          </AuthProvider>
        } 
      />
      
      {/* Catch-all for non-admin routes */}
      <Route 
        path="*" 
        element={
          <AuthProvider>
            <NotFound />
          </AuthProvider>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
