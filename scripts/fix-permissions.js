#!/usr/bin/env node

/**
 * Script to help diagnose and fix Appwrite permissions issues
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('\n🔧 Appwrite Permissions Fix Guide');
  console.log('=====================================\n');
  
  console.log('The registration error you\'re experiencing is likely due to collection permissions.');
  console.log('Here\'s how to fix it:\n');
  
  console.log('📋 STEPS TO FIX:\n');
  
  console.log('1. Open your Appwrite Console (https://cloud.appwrite.io/console)');
  console.log('2. Navigate to your project');
  console.log('3. Go to "Databases" → Select your database');
  console.log('4. Find the "users" collection and click on it');
  console.log('5. Go to the "Settings" tab');
  console.log('6. Click on "Permissions"\n');
  
  console.log('🔑 ADD THESE PERMISSIONS:\n');
  console.log('   ✅ Create: users (allows authenticated users to create documents)');
  console.log('   ✅ Read: users (allows users to read their own documents)');
  console.log('   ✅ Update: users (allows users to update their own documents)');
  console.log('   ✅ Delete: users (optional - allows users to delete their own documents)\n');
  
  console.log('📝 PERMISSION RULES:\n');
  console.log('   - Role: users');
  console.log('   - This gives authenticated users permission to manage their own documents');
  console.log('   - Each user will only be able to access their own user document\n');
  
  console.log('🚀 ALTERNATIVE QUICK FIX:\n');
  console.log('   If you want to test immediately, you can temporarily set:');
  console.log('   - Create: any');
  console.log('   - Read: any');
  console.log('   - Update: any');
  console.log('   ⚠️  WARNING: This is less secure and should only be used for testing!\n');
  
  const proceed = await question('Have you configured the permissions in Appwrite Console? (y/n): ');
  
  if (proceed.toLowerCase() === 'y') {
    console.log('\n✅ Great! Try registering again.');
    console.log('The registration should now work properly.\n');
    
    console.log('💡 ADDITIONAL TIPS:\n');
    console.log('   - Make sure your database ID and collection ID are correct in .env');
    console.log('   - Check that your Appwrite project allows user registration');
    console.log('   - Verify your project ID is correct\n');
  } else {
    console.log('\n⚠️  Please configure the permissions first, then try again.');
    console.log('The registration will fail until the permissions are properly set.\n');
  }
  
  console.log('🔍 DEBUGGING INFO:\n');
  console.log('   Your current configuration:');
  console.log('   - Project ID: 688e1e520023df233fb5');
  console.log('   - Database ID: rbiucjihorb817nerg3mvx');
  console.log('   - User Collection ID: vxyq5kqtz3h6s7z62in2pm\n');
  
  console.log('📚 Need more help? Check APPWRITE_SETUP.md for detailed setup instructions.\n');
  
  rl.close();
}

main().catch(console.error);
