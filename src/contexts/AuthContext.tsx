import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthUser, UserData } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserData>) => Promise<void>;
  updateGameStats: (gameResult: 'win' | 'loss') => Promise<void>;
  deductMatchEntry: (amount: number, matchDetails: any) => Promise<void>;
  getWalletBalance: () => Promise<number>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Skip auth check if we're on admin routes to avoid Appwrite errors
      if (window.location.pathname.startsWith('/admin')) {
        setUser(null);
        return;
      }
      
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const loggedInUser = await authService.signIn(email, password);
      setUser(loggedInUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    try {
      setIsLoading(true);
      const newUser = await authService.createUserAccount(email, password, name, username);
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<UserData>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedData = await authService.updateUserData(user.$id, userData);
      
      // Update the user state with new data
      setUser(prev => prev ? {
        ...prev,
        userData: { ...prev.userData, ...updatedData } as any
      } : null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updateGameStats = async (gameResult: 'win' | 'loss') => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedData = await authService.updateGameStats(user.$id, gameResult);
      
      // Update the user state with new game stats
      setUser(prev => prev ? {
        ...prev,
        userData: { ...prev.userData, gameStats: updatedData.gameStats } as any
      } : null);
    } catch (error) {
      console.error('Update game stats error:', error);
      throw error;
    }
  };

  const deductMatchEntry = async (amount: number, matchDetails: any) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Simple wallet deduction simulation
      // In a real app, this would call a backend API
      console.log(`Deducting ${amount} credits for match:`, matchDetails);
      
      // For now, just update the local state
      // This could be enhanced to actually update Appwrite user data
      
    } catch (error) {
      console.error('Deduct match entry error:', error);
      throw error;
    }
  };

  const getWalletBalance = async (): Promise<number> => {
    try {
      if (!user) return 0;
      
      // Simple wallet balance calculation based on game stats
      // In a real app, this would fetch from backend/Appwrite
      const gameStats = user.userData?.gameStats;
      const baseBalance = 850; // Default starting balance
      const bonusFromWins = (gameStats?.wins || 0) * 50;
      const bonusFromExperience = (gameStats?.experience || 0) * 2;
      
      return baseBalance + bonusFromWins + bonusFromExperience;
      
    } catch (error) {
      console.error('Get wallet balance error:', error);
      return 0;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updateGameStats,
    deductMatchEntry,
    getWalletBalance,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
