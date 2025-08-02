#!/usr/bin/env node

/**
 * Simple Environment Setup Script for MANA Gaming Project
 * This script updates your .env file with the provided Appwrite project ID
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;

if (!PROJECT_ID) {
  console.error(`
❌ Missing APPWRITE_PROJECT_ID environment variable!

Usage: APPWRITE_PROJECT_ID=your_project_id node scripts/setup-env.js
  `);
  process.exit(1);
}

function updateEnvFile() {
  try {
    console.log('📝 Updating .env file with your project ID...\n');
    
    const envPath = path.join(__dirname, '..', '.env');
    
    let envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}
VITE_APPWRITE_PROJECT_ID=${PROJECT_ID}
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id_here
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
`;

    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Environment file updated successfully!');
    console.log(`Project ID set to: ${PROJECT_ID}`);
    
    console.log(`
🚀 Next Steps:

1. Go to your Appwrite Console: https://cloud.appwrite.io/console/project-${PROJECT_ID}

2. Create a Database:
   - Go to "Databases" in the sidebar
   - Click "Create Database"
   - Name it "MANA Gaming Database"
   - Copy the Database ID and update VITE_APPWRITE_DATABASE_ID in your .env file

3. Create a Collection named "users":
   - Inside your database, click "Create Collection"
   - Name it "users"
   - Copy the Collection ID and update VITE_APPWRITE_USER_COLLECTION_ID in your .env file

4. Add these attributes to the "users" collection:
   - name (String, 255 chars, required)
   - email (Email, required)
   - username (String, 100 chars, required)
   - avatar (URL, optional)
   - preferences (String, 1000 chars, optional)
   - gameStats (String, 2000 chars, optional)
   - createdAt (DateTime, optional)
   - updatedAt (DateTime, optional)

5. Set Collection Permissions:
   - Read: Any
   - Create: Users
   - Update: Users (User ID)
   - Delete: Users (User ID)

6. Create indexes:
   - Index on "username" field
   - Index on "email" field

7. Enable Authentication:
   - Go to "Auth" → "Settings"
   - Enable "Email/Password" authentication

8. Create Storage Bucket (optional):
   - Go to "Storage"
   - Create bucket named "User Avatars"
   - Allow image file types
   - Copy the Bucket ID and update VITE_APPWRITE_STORAGE_BUCKET_ID in your .env file

9. Test your setup:
   - Run "npm run dev"
   - Try registering a new user

📖 For detailed instructions, see APPWRITE_SETUP.md
    `);

  } catch (error) {
    console.error('❌ Failed to update environment file:', error);
    process.exit(1);
  }
}

// Run setup
updateEnvFile();
