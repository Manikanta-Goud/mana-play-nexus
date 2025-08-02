#!/usr/bin/env node

/**
 * Simple Appwrite Connection Test using REST API
 */

import fetch from 'node-fetch';
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

console.log('🧪 Testing Appwrite Configuration via REST API...\n');

async function makeRequest(endpoint) {
  const url = `${APPWRITE_ENDPOINT}${endpoint}`;
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
    }
  };

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

async function testConnection() {
  try {
    console.log('📋 Configuration:');
    console.log(`   Endpoint: ${APPWRITE_ENDPOINT}`);
    console.log(`   Project ID: ${PROJECT_ID}`);
    console.log(`   Database ID: ${DATABASE_ID}`);
    console.log(`   Collection ID: ${COLLECTION_ID}\n`);

    // Test 1: Check database
    console.log('🗄️  Testing database access...');
    const database = await makeRequest(`/databases/${DATABASE_ID}`);
    console.log(`✅ Database found: ${database.name}`);

    // Test 2: Check collection
    console.log('📊 Testing collection access...');
    const collection = await makeRequest(`/databases/${DATABASE_ID}/collections/${COLLECTION_ID}`);
    console.log(`✅ Collection found: ${collection.name}`);

    // Test 3: List attributes
    console.log('📝 Checking collection attributes...');
    const attributes = await makeRequest(`/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes`);
    console.log(`✅ Found ${attributes.total} attributes:`);
    attributes.attributes.forEach(attr => {
      console.log(`   - ${attr.key} (${attr.type})`);
    });

    console.log(`
🎉 All tests passed! Your Appwrite setup is working correctly.

✅ Database connection: OK
✅ Collection access: OK  
✅ Attributes configured: OK

📊 Your setup includes:
   - Database: ${database.name}
   - Collection: ${collection.name}
   - Attributes: ${attributes.total} configured

🚀 Ready to test:
1. Open your app: http://localhost:8081
2. Try registering a new user
3. Test the login functionality
4. Check the user dashboard

⚠️  Don't forget to enable Email/Password authentication in your Appwrite console!
👉 https://cloud.appwrite.io/console/project-${PROJECT_ID}/auth/settings

Happy gaming! 🎮
    `);

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.message.includes('404')) {
      console.log(`
💡 Troubleshooting tips:
- Check if your database/collection IDs are correct in .env
- Verify the resources exist in your Appwrite console
- Make sure the setup script completed successfully
      `);
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log(`
💡 Troubleshooting tips:
- Check if your project ID is correct
- Verify your endpoint URL
- Make sure the project exists and is accessible
      `);
    }
    
    console.log(`
🔧 Debug info:
   Using endpoint: ${APPWRITE_ENDPOINT}
   Project ID: ${PROJECT_ID}
   Database ID: ${DATABASE_ID}
   Collection ID: ${COLLECTION_ID}
    `);
  }
}

testConnection();
