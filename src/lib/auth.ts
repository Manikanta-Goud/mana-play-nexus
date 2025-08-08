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
}

export const authService = new AuthService();
