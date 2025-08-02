#!/usr/bin/env node

/**
 * Appwrite Setup Script for MANA Gaming Project
 * This script helps you set up your Appwrite project with the necessary configurations
 */

import { Client, Databases, Storage, Permission, Role, ID } from 'appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY; // Admin API key needed for setup

if (!PROJECT_ID) {
  console.error(`
❌ Missing required environment variables!

Please set the following environment variables:
- APPWRITE_PROJECT_ID: Your Appwrite project ID

You can find these in your Appwrite console at: https://cloud.appwrite.io/console

Note: API_KEY is optional for basic setup, but required for advanced configuration.
  `);
  process.exit(1);
}

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

// Set API key if provided
if (API_KEY) {
  try {
    client.setKey(API_KEY);
  } catch (error) {
    console.log('⚠️  Could not set API key. Some operations may not work.');
  }
}

const databases = new Databases(client);
const storage = new Storage(client);

async function setupAppwrite() {
  try {
    console.log('🚀 Starting Appwrite setup for MANA Gaming...\n');

    // Create database
    console.log('📊 Creating database...');
    const database = await databases.create(
      ID.unique(),
      'MANA Gaming Database'
    );
    console.log(`✅ Database created: ${database.name} (${database.$id})`);

    // Create users collection
    console.log('\n👥 Creating users collection...');
    const usersCollection = await databases.createCollection(
      database.$id,
      ID.unique(),
      'users'
    );
    console.log(`✅ Users collection created: ${usersCollection.name} (${usersCollection.$id})`);

    // Create attributes for users collection
    console.log('\n🏗️  Creating user collection attributes...');
    
    const attributes = [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'email', type: 'email', required: true },
      { key: 'username', type: 'string', size: 100, required: true },
      { key: 'avatar', type: 'url', required: false },
      { key: 'preferences', type: 'string', size: 1000, required: false }, // JSON string
      { key: 'gameStats', type: 'string', size: 2000, required: false }, // JSON string
      { key: 'createdAt', type: 'datetime', required: false },
      { key: 'updatedAt', type: 'datetime', required: false }
    ];

    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            database.$id,
            usersCollection.$id,
            attr.key,
            attr.size,
            attr.required
          );
        } else if (attr.type === 'email') {
          await databases.createEmailAttribute(
            database.$id,
            usersCollection.$id,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'url') {
          await databases.createUrlAttribute(
            database.$id,
            usersCollection.$id,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'datetime') {
          await databases.createDatetimeAttribute(
            database.$id,
            usersCollection.$id,
            attr.key,
            attr.required
          );
        }
        console.log(`  ✅ Created attribute: ${attr.key}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`  ⚠️  Attribute ${attr.key} might already exist or failed: ${error.message}`);
      }
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    try {
      await databases.createIndex(
        database.$id,
        usersCollection.$id,
        'username_index',
        'key',
        ['username'],
        ['asc']
      );
      console.log('  ✅ Created username index');
    } catch (error) {
      console.log(`  ⚠️  Username index might already exist: ${error.message}`);
    }

    try {
      await databases.createIndex(
        database.$id,
        usersCollection.$id,
        'email_index',
        'key',
        ['email'],
        ['asc']
      );
      console.log('  ✅ Created email index');
    } catch (error) {
      console.log(`  ⚠️  Email index might already exist: ${error.message}`);
    }

    // Create storage bucket for user avatars
    console.log('\n🗂️  Creating storage bucket...');
    try {
      const bucket = await storage.createBucket(
        ID.unique(),
        'User Avatars'
      );
      console.log(`✅ Storage bucket created: ${bucket.name} (${bucket.$id})`);
      
      // Update .env file
      console.log('\n📝 Updating .env file...');
      const envPath = path.join(__dirname, '..', '.env');
      
      let envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}
VITE_APPWRITE_PROJECT_ID=${PROJECT_ID}
VITE_APPWRITE_DATABASE_ID=${database.$id}
VITE_APPWRITE_USER_COLLECTION_ID=${usersCollection.$id}
VITE_APPWRITE_STORAGE_BUCKET_ID=${bucket.$id}
`;

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment file updated');
      
    } catch (error) {
      console.log(`⚠️  Storage bucket creation failed: ${error.message}`);
      
      // Update .env file without storage bucket
      console.log('\n📝 Updating .env file...');
      const envPath = path.join(__dirname, '..', '.env');
      
      let envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}
VITE_APPWRITE_PROJECT_ID=${PROJECT_ID}
VITE_APPWRITE_DATABASE_ID=${database.$id}
VITE_APPWRITE_USER_COLLECTION_ID=${usersCollection.$id}
VITE_APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
`;

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Environment file updated');
    }

    console.log(`
🎉 Appwrite setup completed successfully!

Your configuration:
- Database ID: ${database.$id}
- Users Collection ID: ${usersCollection.$id}
- Project ID: ${PROJECT_ID}

Next steps:
1. Update your .env file with the correct values if needed
2. Make sure your Appwrite project authentication settings are configured
3. Enable email/password authentication in your Appwrite console
4. Test the authentication flow in your application

Happy gaming! 🎮
    `);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupAppwrite();
