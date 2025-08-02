# MANA Gaming - Appwrite Setup Checklist

## ✅ Completed
- [x] Appwrite project created (ID: 688e1e520023df233fb5)
- [x] Environment file updated with project ID
- [x] Appwrite SDK installed and configured

## 📋 Next Steps (Manual Setup Required)

### 1. Database Setup
Visit: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/databases

1. **Create Database**
   - Click "Create Database"
   - Name: "MANA Gaming Database"
   - Enable: Yes
   - **Copy the Database ID** and update `VITE_APPWRITE_DATABASE_ID` in your `.env` file

### 2. Users Collection Setup
In your new database:

1. **Create Collection**
   - Click "Create Collection"
   - Name: "users"
   - **Copy the Collection ID** and update `VITE_APPWRITE_USER_COLLECTION_ID` in your `.env` file

2. **Add Attributes** (in this exact order):
   ```
   name         - String (255)  - Required
   email        - Email         - Required  
   username     - String (100)  - Required
   avatar       - URL           - Optional
   preferences  - String (1000) - Optional
   gameStats    - String (2000) - Optional
   createdAt    - DateTime      - Optional
   updatedAt    - DateTime      - Optional
   ```

3. **Create Indexes**:
   - Index 1: Key "username_index" on field "username" (ASC)
   - Index 2: Key "email_index" on field "email" (ASC)

4. **Set Permissions**:
   - Read: `any()`
   - Create: `users()`
   - Update: `users("user:USER_ID")`
   - Delete: `users("user:USER_ID")`

### 3. Authentication Setup
Visit: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/auth/settings

1. **Enable Email/Password Authentication**
   - Toggle on "Email/Password"
   - Set session length as desired
   - Configure password requirements

### 4. Storage Setup (Optional)
Visit: https://cloud.appwrite.io/console/project-688e1e520023df233fb5/storage

1. **Create Bucket**
   - Click "Create Bucket"
   - Name: "User Avatars"
   - File size limit: 10MB
   - Allowed extensions: jpg, jpeg, png, gif, webp
   - **Copy the Bucket ID** and update `VITE_APPWRITE_STORAGE_BUCKET_ID` in your `.env` file

### 5. Final Configuration
Update your `.env` file with the IDs you copied:
```env
VITE_APPWRITE_DATABASE_ID=your_actual_database_id
VITE_APPWRITE_USER_COLLECTION_ID=your_actual_collection_id
VITE_APPWRITE_STORAGE_BUCKET_ID=your_actual_bucket_id
```

### 6. Test Your Setup
```bash
npm run dev
```

Visit your application and try:
- Registering a new user
- Logging in
- Checking the user dashboard

## 🔧 Troubleshooting

If you encounter issues:

1. **Check Console Errors**: Open browser dev tools and check for any API errors
2. **Verify IDs**: Make sure all IDs in `.env` are correct
3. **Check Permissions**: Ensure collection permissions are set correctly
4. **Authentication**: Verify email/password auth is enabled

## 📚 Resources

- [Appwrite Console](https://cloud.appwrite.io/console/project-688e1e520023df233fb5)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Setup Guide](./APPWRITE_SETUP.md)

## 🆘 Need Help?

If you encounter any issues during setup, check the `APPWRITE_SETUP.md` file for detailed instructions and troubleshooting tips.
