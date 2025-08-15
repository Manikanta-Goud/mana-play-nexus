import { ID, Query, Models } from 'appwrite';
import { account, databases, appwriteConfig } from './appwrite';

// Types for user data
export interface UserData {
  name: string;
  email: string;
  username: string;
  avatar?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    privacy?: string;
  };
  gameStats?: {
    gamesPlayed?: number;
    wins?: number;
    losses?: number;
    winRate?: number;
    rank?: string;
    experience?: number;
  };
  wallet?: {
    balance?: number;
    totalEarnings?: number;
    totalSpent?: number;
    transactions?: Array<{
      id: string;
      type: 'credit' | 'debit' | 'match_entry' | 'match_reward' | 'admin_adjustment';
      amount: number;
      description: string;
      date: string;
      matchId?: string;
      adminId?: string;
    }>;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDocument extends UserData, Models.Document {}

export interface AuthUser extends Models.User<Models.Preferences> {
  userData?: UserDocument;
}

class AuthService {
  // Create a new user account
  async createUserAccount(email: string, password: string, name: string, username: string): Promise<AuthUser> {
    try {
      // Create account
      const newAccount = await account.create(ID.unique(), email, password, name);
      
      if (!newAccount) throw new Error('Failed to create account');

      // Sign in the user automatically after registration
      await this.signIn(email, password);

      // Try to create user document in database
      let userDocument = null;
      try {
        const userData: UserData = {
          name,
          email,
          username,
          preferences: {
            theme: 'dark',
            notifications: true,
            privacy: 'public'
          },
          gameStats: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            rank: 'Beginner',
            experience: 0
          },
          wallet: {
            balance: 1000, // Starting balance of 1000 credits
            totalEarnings: 1000,
            totalSpent: 0,
            transactions: [{
              id: ID.unique(),
              type: 'credit',
              amount: 1000,
              description: 'Welcome bonus - New player registration',
              date: new Date().toISOString()
            }]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        userDocument = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          newAccount.$id,
          userData
        );
      } catch (dbError) {
        console.warn('Could not create user document - check collection permissions:', dbError);
        // Continue without user document for now
      }
      
      return {
        ...newAccount,
        userData: userDocument as unknown as UserDocument
      };
    } catch (error) {
      console.error('Error creating user account:', error);
      throw error;
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser> {
    try {
      const currentAccount = await account.get();
      
      if (!currentAccount) throw new Error('No current user');

      // Try to get user data from database
      let userData = null;
      try {
        userData = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          currentAccount.$id
        );
      } catch (dbError) {
        console.warn('Could not fetch user document - user data not available:', dbError);
        // Continue without user document
      }

      return {
        ...currentAccount,
        userData: userData as unknown as UserDocument
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  // Create user document (can be called after successful registration)
  async createUserDocument(userId: string, name: string, email: string, username: string): Promise<UserDocument> {
    try {
      const userData: UserData = {
        name,
        email,
        username,
        preferences: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        },
        gameStats: {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          rank: 'Beginner',
          experience: 0
        },
        wallet: {
          balance: 1000, // Starting balance of 1000 credits
          totalEarnings: 1000,
          totalSpent: 0,
          transactions: [{
            id: ID.unique(),
            type: 'credit',
            amount: 1000,
            description: 'Welcome bonus - New player registration',
            date: new Date().toISOString()
          }]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const userDocument = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        userData
      );

      return userDocument as unknown as UserDocument;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Update user data
  async updateUserData(userId: string, userData: Partial<UserData>): Promise<UserData> {
    try {
      const updatedData = {
        ...userData,
        updatedAt: new Date().toISOString()
      };

      const updatedDocument = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        updatedData
      );

      return updatedDocument as unknown as UserData;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  // Update game stats
  async updateGameStats(userId: string, gameResult: 'win' | 'loss'): Promise<UserData> {
    try {
      const currentUser = await this.getCurrentUser();
      const currentStats = currentUser.userData?.gameStats || {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        rank: 'Beginner',
        experience: 0
      };

      const newStats = {
        ...currentStats,
        gamesPlayed: currentStats.gamesPlayed! + 1,
        wins: gameResult === 'win' ? currentStats.wins! + 1 : currentStats.wins,
        losses: gameResult === 'loss' ? currentStats.losses! + 1 : currentStats.losses,
        experience: currentStats.experience! + (gameResult === 'win' ? 10 : 5)
      };

      // Calculate win rate
      newStats.winRate = newStats.gamesPlayed > 0 ? (newStats.wins / newStats.gamesPlayed) * 100 : 0;

      // Update rank based on experience
      if (newStats.experience >= 1000) newStats.rank = 'Master';
      else if (newStats.experience >= 500) newStats.rank = 'Expert';
      else if (newStats.experience >= 200) newStats.rank = 'Advanced';
      else if (newStats.experience >= 50) newStats.rank = 'Intermediate';

      return await this.updateUserData(userId, { gameStats: newStats });
    } catch (error) {
      console.error('Error updating game stats:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check if required config is available
      if (!appwriteConfig.projectId || !appwriteConfig.endpoint) {
        console.warn('Appwrite configuration is incomplete');
        return false;
      }
      
      await account.get();
      return true;
    } catch (error: any) {
      // Don't log errors for admin routes or when user is simply not logged in
      if (!window.location.pathname.startsWith('/admin') && 
          !error.message?.includes('unauthorized') && 
          !error.message?.includes('401')) {
        console.warn('Authentication check failed:', error.message);
      }
      return false;
    }
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<UserData | null> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('username', username)]
      );

      return response.documents.length > 0 ? response.documents[0] as unknown as UserData : null;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return null;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Update password
  async updatePassword(password: string, oldPassword: string): Promise<void> {
    try {
      await account.updatePassword(password, oldPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // Wallet Management Functions
  
  // Deduct credits for match registration
  async deductMatchEntry(userId: string, amount: number, matchDetails: {
    matchId: string;
    mode: string;
    map: string;
    time: string;
  }): Promise<UserData> {
    try {
      const currentUser = await this.getCurrentUser();
      const currentWallet = currentUser.userData?.wallet || {
        balance: 0,
        totalEarnings: 0,
        totalSpent: 0,
        transactions: []
      };

      // Check if user has sufficient balance
      if (currentWallet.balance! < amount) {
        throw new Error(`Insufficient credits. Required: ${amount}, Available: ${currentWallet.balance}`);
      }

      // Create transaction record
      const transaction = {
        id: ID.unique(),
        type: 'match_entry' as const,
        amount: amount,
        description: `Match entry fee - ${matchDetails.mode} ${matchDetails.map} at ${matchDetails.time}`,
        date: new Date().toISOString(),
        matchId: matchDetails.matchId
      };

      // Update wallet
      const updatedWallet = {
        balance: currentWallet.balance! - amount,
        totalEarnings: currentWallet.totalEarnings,
        totalSpent: (currentWallet.totalSpent || 0) + amount,
        transactions: [transaction, ...(currentWallet.transactions || [])].slice(0, 50) // Keep last 50 transactions
      };

      return await this.updateUserData(userId, { wallet: updatedWallet });
    } catch (error) {
      console.error('Error deducting match entry credits:', error);
      throw error;
    }
  }

  // Add credits (for winnings, admin bonuses, etc.)
  async addCredits(userId: string, amount: number, description: string, type: 'match_reward' | 'admin_adjustment' | 'credit' = 'credit', additionalData?: any): Promise<UserData> {
    try {
      const currentUser = await this.getCurrentUser();
      const currentWallet = currentUser.userData?.wallet || {
        balance: 0,
        totalEarnings: 0,
        totalSpent: 0,
        transactions: []
      };

      // Create transaction record
      const transaction = {
        id: ID.unique(),
        type: type,
        amount: amount,
        description: description,
        date: new Date().toISOString(),
        ...additionalData
      };

      // Update wallet
      const updatedWallet = {
        balance: (currentWallet.balance || 0) + amount,
        totalEarnings: (currentWallet.totalEarnings || 0) + amount,
        totalSpent: currentWallet.totalSpent,
        transactions: [transaction, ...(currentWallet.transactions || [])].slice(0, 50) // Keep last 50 transactions
      };

      return await this.updateUserData(userId, { wallet: updatedWallet });
    } catch (error) {
      console.error('Error adding credits:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getWalletBalance(userId: string): Promise<number> {
    try {
      const currentUser = await this.getCurrentUser();
      return currentUser.userData?.wallet?.balance || 0;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return 0;
    }
  }

  // Get transaction history
  async getTransactionHistory(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const currentUser = await this.getCurrentUser();
      const transactions = currentUser.userData?.wallet?.transactions || [];
      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }
}

export const authService = new AuthService();
