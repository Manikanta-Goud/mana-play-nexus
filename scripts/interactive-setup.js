#!/usr/bin/env node

/**
 * Interactive Setup Helper for MANA Gaming Project
 * This helps update the .env file when you get the IDs manually
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function interactiveSetup() {
  console.log(`
🎮 MANA Gaming - Interactive Setup Helper

This will help you update your .env file with the Appwrite IDs you got from the manual setup.

Current project ID: 688e1e520023df233fb5
  `);

  try {
    const databaseId = await question('Enter your Database ID: ');
    const collectionId = await question('Enter your Users Collection ID: ');
    const bucketId = await question('Enter your Storage Bucket ID (or press Enter to skip): ');

    if (!databaseId || !collectionId) {
      console.log('❌ Database ID and Collection ID are required!');
      process.exit(1);
    }

    // Update .env file
    const envPath = path.join(__dirname, '..', '.env');
    
    let envContent = `# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=688e1e520023df233fb5
VITE_APPWRITE_DATABASE_ID=${databaseId}
VITE_APPWRITE_USER_COLLECTION_ID=${collectionId}
VITE_APPWRITE_STORAGE_BUCKET_ID=${bucketId || 'your_storage_bucket_id_here'}
`;

    fs.writeFileSync(envPath, envContent);
    
    console.log(`
✅ Environment file updated successfully!

Your configuration:
- Database ID: ${databaseId}
- Collection ID: ${collectionId}
- Bucket ID: ${bucketId || 'Not set'}

🚀 Next steps:
1. Make sure Email/Password authentication is enabled in Appwrite console
2. Run "npm run dev" to test your setup
3. Try registering and logging in

Happy gaming! 🎮
    `);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    rl.close();
  }
}

interactiveSetup();
