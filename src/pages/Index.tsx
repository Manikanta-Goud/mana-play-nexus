import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import GameDashboard from '@/components/GameDashboard';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <GameDashboard username={username} onLogout={handleLogout} />;
};

export default Index;
