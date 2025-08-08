#!/usr/bin/env node

/**
 * Debug script to identify the specific Appwrite error
 */

import { Client, Account } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

async function debugAppwriteError() {
  console.log('🔍 Debugging Appwrite Admin Login Error...\n');
  
  const client = new Client();
  const account = new Account(client);
  
  console.log('📋 Environment Configuration:');
  console.log(`   VITE_APPWRITE_ENDPOINT: ${process.env.VITE_APPWRITE_ENDPOINT}`);
  console.log(`   VITE_APPWRITE_PROJECT_ID: ${process.env.VITE_APPWRITE_PROJECT_ID}`);
  console.log(`   VITE_APPWRITE_DATABASE_ID: ${process.env.VITE_APPWRITE_DATABASE_ID}`);
  console.log(`   VITE_APPWRITE_USER_COLLECTION_ID: ${process.env.VITE_APPWRITE_USER_COLLECTION_ID}\n`);
  
  try {
    client
      .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || '')
      .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '');
    
    console.log('✅ Client configuration successful\n');
    
    console.log('🔐 Testing authentication check...');
    
    try {
      await account.get();
      console.log('✅ User is currently logged in');
    } catch (authError) {
      if (authError.code === 401) {
        console.log('ℹ️  No user currently logged in (this is normal)');
      } else {
        console.log('❌ Authentication error:');
        console.log(`   Code: ${authError.code}`);
        console.log(`   Message: ${authError.message}`);
        console.log(`   Type: ${authError.type}\n`);
        
        if (authError.code === 400) {
          console.log('💡 Possible causes:');
          console.log('   - Invalid project ID');
          console.log('   - Project doesn\'t exist');
          console.log('   - Incorrect endpoint URL\n');
        }
      }
    }
    
    console.log('🎯 Root Cause Analysis:');
    
    if (!process.env.VITE_APPWRITE_PROJECT_ID) {
      console.log('❌ Missing VITE_APPWRITE_PROJECT_ID in .env file');
    } else if (process.env.VITE_APPWRITE_PROJECT_ID.length < 10) {
      console.log('❌ VITE_APPWRITE_PROJECT_ID looks too short, might be invalid');
    } else {
      console.log('✅ Project ID looks valid');
    }
    
    if (!process.env.VITE_APPWRITE_ENDPOINT) {
      console.log('❌ Missing VITE_APPWRITE_ENDPOINT in .env file');
    } else {
      console.log('✅ Endpoint looks valid');
    }
    
    console.log('\n🔧 Solutions:');
    console.log('1. ✅ Admin login now bypasses Appwrite - should work');
    console.log('2. 🔒 Admin routes are isolated from regular auth');
    console.log('3. ⚠️  If still having issues, try clearing browser cache/localStorage');
    console.log('4. 🌐 Navigate directly to http://localhost:8082/admin');
    
  } catch (error) {
    console.error('❌ Critical error:', error.message);
    console.log('\n🚨 This indicates a fundamental configuration issue');
    console.log('Please check your .env file and Appwrite project settings');
  }
}

debugAppwriteError().catch(console.error);
