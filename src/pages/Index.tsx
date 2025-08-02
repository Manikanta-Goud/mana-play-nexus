import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppwriteLoginForm from '@/components/AppwriteLoginForm';
import GameDashboard from '@/components/GameDashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AppwriteLoginForm />;
  }

  return (
    <GameDashboard 
      username={user.userData?.username || user.name} 
      onLogout={handleLogout} 
    />
  );
};

export default Index;
