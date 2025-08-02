/**
 * MANA Gaming - Appwrite Integration Example
 * 
 * This file demonstrates how to use the Appwrite authentication and database
 * integration in your React components.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/hooks/useUser';
import { authService } from '@/lib/auth';

// Example: Simple authentication component
export const AuthExample = () => {
  const { login, register, logout, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await register(email, password, 'Test User', 'testuser');
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
};

// Example: User profile component
export const UserProfileExample = () => {
  const { displayName, username, email, stats, level, rank, updateProfile } = useUser();

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        preferences: {
          theme: 'light',
          notifications: false
        }
      });
      alert('Profile updated!');
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2>User Profile</h2>
      <p>Name: {displayName}</p>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Level: {level}</p>
      <p>Rank: {rank}</p>
      <p>Games Played: {stats.gamesPlayed}</p>
      <p>Win Rate: {stats.winRate}%</p>
      <button onClick={handleUpdateProfile}>Update Preferences</button>
    </div>
  );
};

// Example: Game statistics component
export const GameStatsExample = () => {
  const { incrementGamesPlayed, stats } = useUser();

  const handleWin = () => incrementGamesPlayed(true);
  const handleLoss = () => incrementGamesPlayed(false);

  return (
    <div className="p-4">
      <h2>Game Statistics</h2>
      <div>
        <p>Games: {stats.gamesPlayed}</p>
        <p>Wins: {stats.wins}</p>
        <p>Losses: {stats.losses}</p>
        <p>Experience: {stats.experience}</p>
      </div>
      <button onClick={handleWin}>Record Win</button>
      <button onClick={handleLoss}>Record Loss</button>
    </div>
  );
};

// Example: Direct API usage
export const DirectAPIExample = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Example of using the auth service directly
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        console.log('Current user:', user);
      } catch (error) {
        console.log('No user logged in');
      }
    };

    // Example of checking authentication status
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      console.log('Is authenticated:', isAuth);
    };

    fetchCurrentUser();
    checkAuth();
  }, []);

  const findUserByUsername = async (username: string) => {
    try {
      const user = await authService.getUserByUsername(username);
      console.log('Found user:', user);
    } catch (error) {
      console.error('User not found:', error);
    }
  };

  return (
    <div className="p-4">
      <h2>Direct API Usage</h2>
      <button onClick={() => findUserByUsername('testuser')}>
        Find User by Username
      </button>
    </div>
  );
};

// Example: Complete authentication flow
export const CompleteAuthFlow = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading authentication...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthExample />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1>MANA Gaming Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <UserProfileExample />
          <GameStatsExample />
        </div>
        <DirectAPIExample />
      </div>
    </div>
  );
};

export default CompleteAuthFlow;
