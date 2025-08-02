
# 🎮 MANA Gaming - Manual Appwrite Setup

## Project Information
- **Project ID**: 688e1e520023df233fb5
- **Console URL**: https://cloud.appwrite.io/console/project-688e1e520023df233fb5

## Step 1: Create Database

1. Go to: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/databases
2. Click "Create Database"
3. Enter name: **MANA Gaming Database**
4. Click "Create"
5. **Copy the Database ID** and update your .env file

## Step 2: Create Users Collection

1. Inside your new database, click "Create Collection"
2. Enter name: **users**
3. Click "Create"
4. **Copy the Collection ID** and update your .env file

## Step 3: Add Attributes to Users Collection

Click "Create Attribute" for each of these (in order):

### Required Attributes:
1. **name**
   - Type: String
   - Size: 255
   - Required: ✅
   - Array: ❌

2. **email**
   - Type: Email
   - Required: ✅
   - Array: ❌

3. **username**
   - Type: String
   - Size: 100
   - Required: ✅
   - Array: ❌

### Optional Attributes:
4. **avatar**
   - Type: URL
   - Required: ❌
   - Array: ❌

5. **preferences**
   - Type: String
   - Size: 1000
   - Required: ❌
   - Array: ❌

6. **gameStats**
   - Type: String
   - Size: 2000
   - Required: ❌
   - Array: ❌

7. **createdAt**
   - Type: DateTime
   - Required: ❌
   - Array: ❌

8. **updatedAt**
   - Type: DateTime
   - Required: ❌
   - Array: ❌

## Step 4: Create Indexes

1. Go to "Indexes" tab in your collection
2. Click "Create Index"

### Index 1:
- **Key**: username_index
- **Type**: Key
- **Attributes**: username
- **Order**: ASC

### Index 2:
- **Key**: email_index
- **Type**: Key
- **Attributes**: email
- **Order**: ASC

## Step 5: Set Collection Permissions

1. Go to "Settings" tab in your collection
2. Set these permissions:

### Collection Permissions:
- **Read**: `any()`
- **Create**: `users()`
- **Update**: `users()`
- **Delete**: `users()`

### Document Security:
- Enable "Document Security" ✅

## Step 6: Enable Authentication

1. Go to: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/auth/settings
2. Find "Email/Password" authentication
3. Toggle it ON ✅
4. Configure settings:
   - Session Length: 1 year (recommended)
   - Password History: 5 (recommended)
   - Password Dictionary: Enable ✅

## Step 7: Create Storage Bucket (Optional)

1. Go to: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/storage
2. Click "Create Bucket"
3. Enter name: **User Avatars**
4. Set permissions:
   - **Read**: `any()`
   - **Create**: `users()`
   - **Update**: `users()`
   - **Delete**: `users()`
5. Configure settings:
   - Max file size: 10MB
   - Allowed extensions: jpg, jpeg, png, gif, webp
6. **Copy the Bucket ID** and update your .env file

## Step 8: Update Environment File

Update your `.env` file with the IDs you copied:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=688e1e520023df233fb5
VITE_APPWRITE_DATABASE_ID=your_actual_database_id_here
VITE_APPWRITE_USER_COLLECTION_ID=your_actual_collection_id_here
VITE_APPWRITE_STORAGE_BUCKET_ID=your_actual_bucket_id_here
```

## Step 9: Test Your Setup

1. Save your `.env` file
2. Run: `npm run dev`
3. Open your browser to the local development URL
4. Try registering a new user
5. Check if login works
6. Verify user data appears in your Appwrite console

## ✅ Verification Checklist

- [ ] Database created
- [ ] Users collection created with all 8 attributes
- [ ] Indexes created for username and email
- [ ] Collection permissions set correctly
- [ ] Email/Password authentication enabled
- [ ] Storage bucket created (optional)
- [ ] .env file updated with all IDs
- [ ] Test registration works
- [ ] Test login works
- [ ] User data appears in Appwrite console

## 🆘 Troubleshooting

### Common Issues:

1. **"Project not found" error**
   - Double-check your project ID in .env
   - Make sure project exists in Appwrite console

2. **"Collection not found" error**
   - Verify collection ID in .env is correct
   - Check if collection exists in your database

3. **Authentication fails**
   - Ensure Email/Password auth is enabled
   - Check if user registration is allowed

4. **Attribute errors**
   - Make sure all required attributes are created
   - Check attribute names match exactly (case-sensitive)

5. **Permission errors**
   - Verify collection permissions are set correctly
   - Enable document security if not already enabled

### Getting Help:

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://discord.gg/appwrite)
- [GitHub Issues](https://github.com/appwrite/appwrite/issues)

---

**Once setup is complete, your MANA Gaming authentication system will be fully functional!** 🎮
