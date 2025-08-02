#!/usr/bin/env node

/**
 * Test User Registration - MANA Gaming
 * This script tests user registration to verify authentication is working
 */

import { Client, Account, ID } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;

console.log('🧪 Testing User Registration...\n');

// Initialize client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const account = new Account(client);

async function testRegistration() {
  try {
    console.log('📋 Configuration:');
    console.log(`   Endpoint: ${APPWRITE_ENDPOINT}`);
    console.log(`   Project ID: ${PROJECT_ID}\n`);

    // Generate random test user data
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    console.log('👤 Creating test user account...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Name: ${testName}\n`);

    // Try to create user account
    const user = await account.create(ID.unique(), testEmail, testPassword, testName);
    
    console.log('✅ User account created successfully!');
    console.log(`   User ID: ${user.$id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Created: ${user.$createdAt}\n`);

    // Try to login
    console.log('🔐 Testing login...');
    const session = await account.createEmailPasswordSession(testEmail, testPassword);
    
    console.log('✅ Login successful!');
    console.log(`   Session ID: ${session.$id}`);
    console.log(`   Provider: ${session.provider}\n`);

    // Get current user
    console.log('👥 Getting user info...');
    const currentUser = await account.get();
    
    console.log('✅ User info retrieved!');
    console.log(`   Current User: ${currentUser.name} (${currentUser.email})\n`);

    // Cleanup - delete session
    console.log('🧹 Cleaning up...');
    await account.deleteSession('current');
    console.log('✅ Session deleted');

    console.log(`
🎉 Authentication test completed successfully!

✅ User registration: WORKING
✅ Email/Password login: WORKING  
✅ Session management: WORKING
✅ User data retrieval: WORKING

🚀 Your MANA Gaming authentication system is fully functional!

📱 Test in your app:
1. Open: http://localhost:8081
2. Register a new user
3. Login with your credentials
4. Check the user dashboard

🎮 Ready to game! Your authentication system is working perfectly.
    `);

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    
    if (error.code === 401) {
      console.log(`
💡 Authentication not enabled:
   Email/Password authentication might not be enabled in your Appwrite console.
   
   👉 Enable it here: https://cloud.appwrite.io/console/project-${PROJECT_ID}/auth/settings
   - Find "Email/Password" section
   - Toggle it ON
   - Save settings
      `);
    } else if (error.code === 400) {
      console.log(`
💡 Configuration issue:
   Check your project settings and make sure:
   - Project ID is correct
   - Endpoint URL is accessible
   - Registration is allowed
      `);
    } else {
      console.log(`
💡 Debug info:
   Error code: ${error.code || 'Unknown'}
   Using endpoint: ${APPWRITE_ENDPOINT}
   Project ID: ${PROJECT_ID}
      `);
    }
  }
}

testRegistration();
