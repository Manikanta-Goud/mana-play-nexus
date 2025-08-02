#!/usr/bin/env node

/**
 * Simplified Appwrite Setup Script for MANA Gaming Project
 * This script creates the essential database structure
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID) {
  console.error('❌ Missing APPWRITE_PROJECT_ID environment variable!');
  process.exit(1);
}

// Helper function to make Appwrite API calls
async function makeAppwriteRequest(endpoint, method = 'GET', data = null) {
  const url = `${APPWRITE_ENDPOINT}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
    }
  };

  if (API_KEY) {
    options.headers['X-Appwrite-Key'] = API_KEY;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    return result;
  } catch (error) {
    throw new Error(`API call failed: ${error.message}`);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function setupAppwrite() {
  try {
    console.log('🚀 Starting simplified Appwrite setup for MANA Gaming...\n');

    // Create database
    console.log('📊 Creating database...');
    const databaseId = generateId();
    const database = await makeAppwriteRequest('/databases', 'POST', {
      databaseId,
      name: 'MANA Gaming Database'
    });
    console.log(`✅ Database created: ${database.name} (${database.$id})`);

    // Create users collection
    console.log('\n👥 Creating users collection...');
    const collectionId = generateId();
    const usersCollection = await makeAppwriteRequest(`/databases/${database.$id}/collections`, 'POST', {
      collectionId,
      name: 'users',
      permissions: [
        'read("any")',
        'create("users")',
        'update("users")',
        'delete("users")'
      ],
      documentSecurity: true,
      enabled: true
    });
    console.log(`✅ Users collection created: ${usersCollection.name} (${usersCollection.$id})`);

    // Create attributes
    console.log('\n🏗️  Creating user collection attributes...');
    
    const attributes = [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'email', type: 'email', required: true },
      { key: 'username', type: 'string', size: 100, required: true },
      { key: 'avatar', type: 'url', required: false },
      { key: 'preferences', type: 'string', size: 1000, required: false },
      { key: 'gameStats', type: 'string', size: 2000, required: false },
      { key: 'createdAt', type: 'datetime', required: false },
      { key: 'updatedAt', type: 'datetime', required: false }
    ];

    for (const attr of attributes) {
      try {
        let endpoint = `/databases/${database.$id}/collections/${usersCollection.$id}/attributes`;
        let payload = {
          key: attr.key,
          required: attr.required,
          default: null
        };

        if (attr.type === 'string') {
          endpoint += '/string';
          payload.size = attr.size;
        } else if (attr.type === 'email') {
          endpoint += '/email';
        } else if (attr.type === 'url') {
          endpoint += '/url';
        } else if (attr.type === 'datetime') {
          endpoint += '/datetime';
        }

        await makeAppwriteRequest(endpoint, 'POST', payload);
        console.log(`  ✅ Created attribute: ${attr.key}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`  ⚠️  Attribute ${attr.key} failed: ${error.message}`);
      }
    }

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    try {
      await makeAppwriteRequest(`/databases/${database.$id}/collections/${usersCollection.$id}/indexes`, 'POST', {
        key: 'username_index',
        type: 'key',
        attributes: ['username'],
        orders: ['ASC']
      });
      console.log('  ✅ Created username index');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await makeAppwriteRequest(`/databases/${database.$id}/collections/${usersCollection.$id}/indexes`, 'POST', {
        key: 'email_index',
        type: 'key',
        attributes: ['email'],
        orders: ['ASC']
      });
      console.log('  ✅ Created email index');
    } catch (error) {
      console.log(`  ⚠️  Index creation failed: ${error.message}`);
    }

    // Try to create storage bucket
    console.log('\n🗂️  Creating storage bucket...');
    let bucketId = 'your_storage_bucket_id_here';
    try {
      const bucket = await makeAppwriteRequest('/storage/buckets', 'POST', {
        bucketId: generateId(),
        name: 'User Avatars',
        permissions: [
          'read("any")',
          'create("users")',
          'update("users")',
          'delete("users")'
        ],
        fileSecurity: false,
        enabled: true,
        maximumFileSize: 10485760,
        allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        compression: 'none',
        encryption: false,
        antivirus: false
      });
      bucketId = bucket.$id;
      console.log(`✅ Storage bucket created: ${bucket.name} (${bucket.$id})`);
    } catch (error) {
      console.log(`⚠️  Storage bucket creation failed: ${error.message}`);
    }

    // Update .env file
    console.log('\n📝 Updating .env file...');
    const envPath = path.join(__dirname, '..', '.env');
    
    let envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}
VITE_APPWRITE_PROJECT_ID=${PROJECT_ID}
VITE_APPWRITE_DATABASE_ID=${database.$id}
VITE_APPWRITE_USER_COLLECTION_ID=${usersCollection.$id}
VITE_APPWRITE_STORAGE_BUCKET_ID=${bucketId}
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file updated');

    console.log(`
🎉 Appwrite setup completed successfully!

Your configuration:
- Database ID: ${database.$id}
- Users Collection ID: ${usersCollection.$id}
- Project ID: ${PROJECT_ID}

Next steps:
1. Enable email/password authentication in your Appwrite console
2. Test your setup by running "npm run dev" and registering a user
3. Check the user dashboard to see the authentication working

Console URL: https://cloud.appwrite.io/console/project-${PROJECT_ID}

Happy gaming! 🎮
    `);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.message.includes('API call failed')) {
      console.log(`
💡 Troubleshooting tips:
1. Make sure your API key has admin permissions
2. Check that your project ID is correct
3. Verify your Appwrite endpoint is accessible
4. Try the manual setup instead using the SETUP_CHECKLIST.md guide
      `);
    }
    
    process.exit(1);
  }
}

// Run setup
setupAppwrite();
