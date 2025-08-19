import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Safe check for admin routes to prevent Appwrite initialization errors
const isAdminRoute = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
};

// Appwrite configuration
const client = new Client();

// Set your Appwrite project details
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
const APPWRITE_USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID || '';
const APPWRITE_STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '';

// Only configure client if not on admin routes
if (!isAdminRoute()) {
  try {
    client
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
  } catch (error) {
    console.warn('Appwrite client configuration failed:', error);
  }
}

// Initialize Appwrite services with safe checks
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export configuration constants
export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  storageBucketId: APPWRITE_STORAGE_BUCKET_ID,
};

export { client };
