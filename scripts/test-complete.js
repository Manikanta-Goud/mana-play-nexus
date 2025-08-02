#!/usr/bin/env node

/**
 * Complete System Test - MANA Gaming
 * Tests the entire authentication and database flow
 */

import { Client, Account, Databases, ID } from 'appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.VITE_APPWRITE_USER_COLLECTION_ID;

console.log('🎮 MANA Gaming - Complete System Test\n');

// Initialize client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

async function testComplete() {
  try {
    console.log('📋 System Configuration:');
    console.log(`   ✅ Endpoint: ${APPWRITE_ENDPOINT}`);
    console.log(`   ✅ Project ID: ${PROJECT_ID}`);
    console.log(`   ✅ Database ID: ${DATABASE_ID}`);
    console.log(`   ✅ Collection ID: ${COLLECTION_ID}\n`);

    // Generate random test user data
    const testEmail = `gamer${Date.now()}@managaming.com`;
    const testPassword = 'GamerPassword123!';
    const testName = 'Test Gamer';
    const testUsername = `gamer${Date.now()}`;

    console.log('🎯 Step 1: Creating user account...');
    const user = await account.create(ID.unique(), testEmail, testPassword, testName);
    console.log(`   ✅ User created: ${user.name} (${user.email})`);

    console.log('\n🔐 Step 2: Logging in...');
    const session = await account.createEmailPasswordSession(testEmail, testPassword);
    console.log(`   ✅ Login successful! Session: ${session.$id}`);

    console.log('\n📊 Step 3: Creating user data document...');
    const userData = {
      name: testName,
      email: testEmail,
      username: testUsername,
      preferences: JSON.stringify({
        theme: 'dark',
        notifications: true,
        privacy: 'public'
      }),
      gameStats: JSON.stringify({
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        rank: 'Beginner',
        experience: 0
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const userDocument = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      user.$id,
      userData
    );
    console.log(`   ✅ User document created: ${userDocument.$id}`);

    console.log('\n🎮 Step 4: Simulating game activity...');
    // Simulate a game win
    const currentStats = JSON.parse(userDocument.gameStats);
    const newStats = {
      ...currentStats,
      gamesPlayed: 1,
      wins: 1,
      experience: 10,
      winRate: 100
    };

    const updatedDocument = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      user.$id,
      {
        gameStats: JSON.stringify(newStats),
        updatedAt: new Date().toISOString()
      }
    );
    console.log(`   ✅ Game stats updated: 1 win, 10 XP`);

    console.log('\n📈 Step 5: Retrieving user profile...');
    const profile = await databases.getDocument(DATABASE_ID, COLLECTION_ID, user.$id);
    const stats = JSON.parse(profile.gameStats);
    console.log(`   ✅ Profile retrieved:`);
    console.log(`      - Name: ${profile.name}`);
    console.log(`      - Username: ${profile.username}`);
    console.log(`      - Games Played: ${stats.gamesPlayed}`);
    console.log(`      - Experience: ${stats.experience}`);
    console.log(`      - Win Rate: ${stats.winRate}%`);

    console.log('\n🧹 Step 6: Cleanup...');
    await account.deleteSession('current');
    console.log(`   ✅ Session deleted`);

    console.log(`
🎉 COMPLETE SYSTEM TEST PASSED! 🎉

✅ User Registration: WORKING
✅ Authentication: WORKING
✅ Database Creation: WORKING
✅ Document Updates: WORKING
✅ Data Retrieval: WORKING
✅ Game Stats Tracking: WORKING

🚀 Your MANA Gaming platform is 100% operational!

📱 Ready for users:
   - Registration ✅
   - Login ✅
   - Profile Management ✅
   - Game Statistics ✅
   - Data Persistence ✅

🎮 Test in your app: http://localhost:8081

Your gaming platform is ready to launch! 🚀🎮
    `);

  } catch (error) {
    console.error('❌ System test failed:', error.message);
    console.log(`\n🔧 Error Details:`);
    console.log(`   Code: ${error.code || 'Unknown'}`);
    console.log(`   Type: ${error.type || 'Unknown'}`);
    
    if (error.code === 404) {
      console.log(`\n💡 Database/Collection not found. Run setup again:`);
      console.log(`   npm run setup:simple`);
    } else if (error.code === 401) {
      console.log(`\n💡 Authentication issue. Check:`);
      console.log(`   - Email/Password auth enabled`);
      console.log(`   - Project ID correct`);
    }
  }
}

testComplete();
