import { useAuth } from '@/contexts/AuthContext';
import { UserData } from '@/lib/auth';

/**
 * Custom hook for accessing and managing user data
 */
export const useUser = () => {
  const { user, updateProfile, updateGameStats, isLoading } = useAuth();

  const userData = user?.userData;

  // Helper functions for common user data operations
  const getUserStats = () => {
    return userData?.gameStats || {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      rank: 'Beginner',
      experience: 0
    };
  };

  const getUserPreferences = () => {
    return userData?.preferences || {
      theme: 'dark',
      notifications: true,
      privacy: 'public'
    };
  };

  const updateUserPreferences = async (newPreferences: Partial<UserData['preferences']>) => {
    const currentPreferences = getUserPreferences();
    await updateProfile({
      preferences: { ...currentPreferences, ...newPreferences }
    });
  };

  const incrementGamesPlayed = async (won: boolean) => {
    await updateGameStats(won ? 'win' : 'loss');
  };

  const getUserRank = () => {
    const stats = getUserStats();
    return stats.rank || 'Beginner';
  };

  const getUserLevel = () => {
    const stats = getUserStats();
    const experience = stats.experience || 0;
    
    // Calculate level based on experience (100 XP per level)
    return Math.floor(experience / 100) + 1;
  };

  const getNextLevelProgress = () => {
    const stats = getUserStats();
    const experience = stats.experience || 0;
    const currentLevelXP = experience % 100;
    return (currentLevelXP / 100) * 100; // Percentage to next level
  };

  const isNewPlayer = () => {
    const stats = getUserStats();
    return (stats.gamesPlayed || 0) === 0;
  };

  const getWinRate = () => {
    const stats = getUserStats();
    return stats.winRate || 0;
  };

  return {
    // User data
    user,
    userData,
    isLoading,
    
    // Stats helpers
    stats: getUserStats(),
    preferences: getUserPreferences(),
    rank: getUserRank(),
    level: getUserLevel(),
    nextLevelProgress: getNextLevelProgress(),
    winRate: getWinRate(),
    isNewPlayer: isNewPlayer(),
    
    // Actions
    updateProfile,
    updateUserPreferences,
    incrementGamesPlayed,
    
    // Computed values
    displayName: userData?.name || user?.name || 'Guest',
    username: userData?.username || 'guest',
    email: userData?.email || user?.email || '',
    avatar: userData?.avatar,
  };
};

export default useUser;
