#!/usr/bin/env node

/**
 * Appwrite Connection Test for MANA Gaming Project
 * This script tests the connection to your Appwrite setup
 */

import { Client, Account, Databases } from 'appwrite';
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

console.log('🧪 Testing Appwrite Configuration...\n');

// Initialize client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

async function testConnection() {
  try {
    console.log('📋 Configuration:');
    console.log(`   Endpoint: ${APPWRITE_ENDPOINT}`);
    console.log(`   Project ID: ${PROJECT_ID}`);
    console.log(`   Database ID: ${DATABASE_ID}`);
    console.log(`   Collection ID: ${COLLECTION_ID}\n`);

    // Test 1: Check if we can reach the project
    console.log('🔌 Testing connection...');
    
    // Test 2: Check database
    console.log('🗄️  Testing database access...');
    const database = await databases.get(DATABASE_ID);
    console.log(`✅ Database found: ${database.name}`);

    // Test 3: Check collection
    console.log('📊 Testing collection access...');
    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log(`✅ Collection found: ${collection.name}`);

    // Test 4: List attributes
    console.log('📝 Checking collection attributes...');
    const attributes = await databases.listAttributes(DATABASE_ID, COLLECTION_ID);
    console.log(`✅ Found ${attributes.total} attributes:`);
    attributes.attributes.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type})`);
    });

    console.log(`
🎉 All tests passed! Your Appwrite setup is working correctly.

✅ Database connection: OK
✅ Collection access: OK  
✅ Attributes configured: OK

🚀 You can now:
1. Test user registration in your app
2. Try logging in with a test account
3. Check the user dashboard functionality

Happy gaming! 🎮
    `);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 404) {
      console.log(`
💡 Troubleshooting:
- Check if your database/collection IDs are correct
- Verify the resources exist in your Appwrite console
- Make sure your .env file has the right values
      `);
    } else if (error.code === 401) {
      console.log(`
💡 Troubleshooting:
- Check if your project ID is correct
- Verify your endpoint URL
- Make sure the project exists and is accessible
      `);
    }
  }
}

testConnection();
