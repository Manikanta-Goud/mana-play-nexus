# Admin Panel Testing Guide

## 🔐 **Admin Access**

### Admin User Credentials
To test admin functionality, use one of these usernames:
- `admin` - Administrator level access
- `superadmin` - Full administrative access
- `moderator` - Basic admin access

### How to Access Admin Panel
1. **Login** with one of the admin usernames above
2. **Look for "Admin Panel" button** in the top-right header area
3. **Click "Admin Panel"** to access the admin control center

---

## 👥 **User Profile Management**

### Features Implemented:
✅ **View Complete User Profiles**
- Full user statistics (games played, wins, kills, etc.)
- Financial information (wallet balance, total earnings)
- Account details and security status
- Risk level assessment

✅ **Credit Management System**
- Add credits to user wallets
- Remove credits with proper reason tracking
- Quick action buttons for common scenarios:
  - +50 Credits (5+ kills bonus)
  - +100 Credits (10+ kills bonus) 
  - +200 Credits (Victory bonus)
  - +500 Credits (Tournament prize)

### How to Test User Management:
1. Go to **Admin Panel → Users Tab**
2. **View Profile**: Click the blue eye icon (👁️) to see complete user profile
3. **Manage Credits**: Click the green wallet icon (💳) to add/remove credits
4. **Ban User**: Click the red ban icon (🚫) for active users
5. **Unban User**: Click the check icon (✅) for banned users

---

## 💳 **Credit Management Features**

### Credit Award System:
The admin can award credits based on:
- **Kill Count**: 50-100 credits per match based on kills
- **Victory Bonus**: 200 credits for winning matches  
- **Tournament Prizes**: 500+ credits for tournament wins
- **Custom Amounts**: Any amount with custom reason

### Usage Example:
1. **Select User**: Click wallet icon next to any user
2. **Choose Amount**: Enter credits or use quick buttons
3. **Add Reason**: Document why credits are being added
   - Example: "Match completion bonus: 12 kills in BR mode"
   - Example: "Tournament prize - 1st place Bermuda"
4. **Confirm Transaction**: Credits are instantly added to user wallet

---

## 🎮 **Test User Data**

### Available Test Users:
1. **Player123** - Regular active player (850 credits)
2. **SuspiciousGamer** - High-risk user (120 credits)  
3. **BannedUser** - Banned account (0 credits)
4. **RegularPlayer** - Casual player (450 credits)
5. **ProGamer2024** - Pro player (2,200 credits)

---

## 🔥 **Admin Capabilities**

### Super Admin (`superadmin`):
- Full access to all features
- User profile management
- Credit management
- Game scheduling
- Security monitoring
- Financial reports

### Admin (`admin`):
- User management
- Credit management  
- Game scheduling
- Security reports

### Moderator (`moderator`):
- User management
- Credit management
- Basic security monitoring

---

## 🧪 **Test Scenarios**

### Scenario 1: Award Kill Bonus
1. Login as `admin`
2. Go to Users tab
3. Find `Player123`
4. Click wallet icon
5. Use "+100 Credits" quick button
6. Confirm transaction
7. Verify credits added to user balance

### Scenario 2: Tournament Prize
1. Find `ProGamer2024`
2. Click wallet icon  
3. Enter `1000` credits
4. Reason: "Tournament winner - Free Fire Championship"
5. Confirm transaction

### Scenario 3: View Complete Profile
1. Click eye icon next to any user
2. Review complete profile information
3. Check financial overview
4. Note security status

---

## 🚀 **Key Features Implemented**

✅ **Dynamic Game/Map Selection** - Maps only show after game selection
✅ **Admin User Profile Viewing** - Complete user statistics and info
✅ **Credit Management System** - Add/remove credits with reason tracking  
✅ **Kill-based Credit Awards** - Bonus system for match performance
✅ **Financial Oversight** - Complete wallet and earnings tracking
✅ **Security Monitoring** - Risk assessment and ban management
✅ **Transaction Logging** - All credit changes documented with reasons

---

## 💡 **Usage Tips**

- **Credit Rate**: 1 Credit = ₹1 (as shown in user profile)
- **Kill Bonuses**: Typically 5-10 credits per kill
- **Victory Bonuses**: 100-200 credits for wins
- **Tournament Prizes**: 500-5000 credits depending on event
- **Always document reasons** for credit transactions for audit trail

The system is now ready for production use with full admin oversight capabilities! 🎉
