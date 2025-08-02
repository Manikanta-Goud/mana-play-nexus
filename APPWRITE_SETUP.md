# Appwrite Integration Guide for MANA Gaming

This guide explains how to set up and use Appwrite database and authentication in your MANA Gaming project.

## 🚀 Quick Start

### 1. Create Appwrite Account
1. Go to [Appwrite Cloud](https://cloud.appwrite.io/console)
2. Create a new account or sign in
3. Create a new project

### 2. Configure Environment Variables
1. Copy the `.env.example` file to `.env`
2. Update the following variables in your `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id_here
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
```

### 3. Set Up Appwrite Project

#### Option A: Automatic Setup (Recommended)
1. Get your Project ID from Appwrite Console
2. Create an API Key with admin permissions in Appwrite Console
3. Run the setup script:

```bash
APPWRITE_PROJECT_ID=your_project_id APPWRITE_API_KEY=your_api_key node scripts/setup-appwrite.js
```

#### Option B: Manual Setup
1. **Create Database:**
   - Go to your Appwrite console
   - Navigate to Databases
   - Create a new database named "MANA Gaming Database"

2. **Create Users Collection:**
   - Inside your database, create a collection named "users"
   - Add the following attributes:
     - `name` (String, 255 chars, required)
     - `email` (Email, required)
     - `username` (String, 100 chars, required)
     - `avatar` (URL, optional)
     - `preferences` (String, 1000 chars, optional)
     - `gameStats` (String, 2000 chars, optional)
     - `createdAt` (DateTime, optional)
     - `updatedAt` (DateTime, optional)

3. **Create Indexes:**
   - Create an index on `username` field
   - Create an index on `email` field

4. **Set Permissions:**
   - Collection permissions: Read (Any), Create (Users), Update (User), Delete (User)
   - Document permissions: Enable document security

5. **Create Storage Bucket:**
   - Go to Storage in Appwrite console
   - Create a bucket named "User Avatars"
   - Set file size limit to 10MB
   - Allow image file types: jpg, jpeg, png, gif, webp

6. **Enable Authentication:**
   - Go to Auth → Settings
   - Enable Email/Password authentication
   - Configure other settings as needed

## 📚 Usage

### Authentication
The project includes a complete authentication system with the following features:

#### Login/Register
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { login, register, user, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register('user@example.com', 'password', 'Full Name', 'username');
      // User is registered and logged in
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.userData?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
}
```

#### User Profile Management
```tsx
const { updateProfile, user } = useAuth();

const handleUpdateProfile = async () => {
  try {
    await updateProfile({
      name: 'New Name',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    });
    // Profile updated successfully
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

#### Game Stats Tracking
```tsx
const { updateGameStats } = useAuth();

const handleGameEnd = async (won: boolean) => {
  try {
    await updateGameStats(won ? 'win' : 'loss');
    // Stats updated automatically
  } catch (error) {
    console.error('Stats update failed:', error);
  }
};
```

### User Data Structure
```typescript
interface UserData {
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
```

## 🛠️ Available Services

### AuthService Methods
- `createUserAccount(email, password, name, username)` - Register new user
- `signIn(email, password)` - Sign in user
- `getCurrentUser()` - Get current authenticated user
- `signOut()` - Sign out current user
- `updateUserData(userId, userData)` - Update user profile
- `updateGameStats(userId, gameResult)` - Update game statistics
- `isAuthenticated()` - Check if user is authenticated
- `getUserByUsername(username)` - Find user by username
- `resetPassword(email)` - Send password reset email
- `updatePassword(newPassword, oldPassword)` - Update user password

### AuthContext Methods
- `login(email, password)` - Login user
- `register(email, password, name, username)` - Register user
- `logout()` - Logout user
- `updateProfile(userData)` - Update user profile
- `updateGameStats(gameResult)` - Update game stats
- `user` - Current user object
- `isLoading` - Loading state
- `isAuthenticated` - Authentication status

## 🔧 Customization

### Adding New User Fields
1. Add the attribute in Appwrite console or update the setup script
2. Update the `UserData` interface in `src/lib/auth.ts`
3. Update the registration form to collect the new data
4. Use the `updateProfile` method to update the new fields

### Custom Authentication Logic
You can extend the `AuthService` class in `src/lib/auth.ts` to add custom authentication logic:

```typescript
// Add to AuthService class
async customMethod() {
  // Your custom logic here
}
```

### Database Queries
You can use the Appwrite databases service directly for custom queries:

```typescript
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

// Get users by rank
const getTopPlayers = async () => {
  return await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.orderDesc('gameStats.experience'), Query.limit(10)]
  );
};
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit real API keys or project IDs to version control
2. **Permissions**: Use proper Appwrite permissions to restrict access to user data
3. **Validation**: Always validate user input on both client and server side
4. **Password Policy**: Enforce strong password requirements
5. **Rate Limiting**: Appwrite provides built-in rate limiting for API requests

## 🐛 Troubleshooting

### Common Issues

1. **"Project not found" error**
   - Check your `VITE_APPWRITE_PROJECT_ID` in `.env`
   - Ensure the project exists in your Appwrite console

2. **"Collection not found" error**
   - Verify your collection IDs in `.env`
   - Make sure the collections exist in your database

3. **Permission denied errors**
   - Check collection and document permissions in Appwrite console
   - Ensure users have proper access rights

4. **CORS errors**
   - Add your domain to the allowed origins in Appwrite console
   - Check that your endpoint URL is correct

### Debug Mode
Enable debug logging by adding this to your code:

```typescript
import { client } from '@/lib/appwrite';

// Enable debug mode (don't use in production)
client.setProject(appwriteConfig.projectId).setEndpoint(appwriteConfig.endpoint);
```

## 📖 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite React SDK](https://appwrite.io/docs/quick-starts/react)
- [Appwrite Authentication Guide](https://appwrite.io/docs/client/account)
- [Appwrite Database Guide](https://appwrite.io/docs/client/databases)

## 🤝 Contributing

When contributing to the authentication system:

1. Test all authentication flows thoroughly
2. Update this documentation if you add new features
3. Follow the existing code patterns and TypeScript interfaces
4. Ensure proper error handling and user feedback

## 📄 License

This integration follows the same license as the main project.
