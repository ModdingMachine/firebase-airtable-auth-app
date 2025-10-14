# Quick Setup Guide

This guide will help you set up and run the Firebase Airtable Auth App locally in minutes.

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] A web browser (Chrome, Firefox, Edge, Safari)

## Step 1: Airtable Setup (5 minutes)

### 1.1 Create Airtable Base
1. Go to https://airtable.com and sign up/log in
2. Click "Create a base" (or "Add a base")
3. Name it something like "Firebase Auth Users"

### 1.2 Create Users Table
1. Rename the default table to `Users`
2. Create these fields (click + to add columns):
   - `uid` - Single line text
   - `email` - Email
   - `displayName` - Single line text
   - `phone` - Phone number
   - `role` - Single select with options: Parent, Educator, Admin
   - `updatedAt` - Last modified time

### 1.3 Get Your Credentials
1. **Base ID**: Go to https://airtable.com/api, select your base
   - The Base ID starts with `app...` (shown in the URL or API docs)
   - Copy this value

2. **Personal Access Token**:
   - Go to https://airtable.com/create/tokens
   - Click "Create new token"
   - Name it "Firebase Auth App"
   - Add scopes: `data.records:read` and `data.records:write`
   - Add access to your base (select it from the list)
   - Click "Create token"
   - Copy the token (starts with `pat...`)

## Step 2: Firebase Setup (5 minutes)

### 2.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it (e.g., "Firebase Airtable Auth")
4. Disable Google Analytics (optional, for faster setup)
5. Click "Create project"

### 2.2 Enable Authentication
1. In the Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Toggle to "Enabled"
5. Click "Save"
6. Click on "Google" under Sign-in method
7. Toggle to "Enabled"
8. Add your support email
9. Click "Save"

### 2.3 Get Web SDK Config
1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app with a nickname (e.g., "Web App")
5. Copy the config object (firebaseConfig)
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-app.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-app.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123:web:abc123"
   };
   ```

### 2.4 Create Service Account (for Backend)
1. Still in Project Settings, click "Service accounts" tab
2. Click "Generate new private key"
3. Click "Generate key" in the dialog
4. A JSON file will download - save it securely (don't commit to git!)
5. Open the JSON file - you'll need these values:
   - `project_id`
   - `private_key`
   - `client_email`

## Step 3: Configure Environment Variables (2 minutes)

### 3.1 Server Configuration
Create `server/.env` file:

```env
PORT=5000
NODE_ENV=development

# From Firebase Service Account JSON
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# From Airtable
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Users
```

**Important**: For `FIREBASE_PRIVATE_KEY`, copy the entire private key from your service account JSON, keep the quotes, and preserve the `\n` characters.

### 3.2 Client Configuration
Create `client/.env` file:

```env
# From Firebase Web SDK Config
VITE_FIREBASE_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# API URL (keep as localhost for local development)
VITE_API_URL=http://localhost:5000
```

## Step 4: Run the Application (1 minute)

### Option A: Run Both Servers Together (Recommended)
From the project root:
```bash
npm run dev
```

### Option B: Run Servers Separately
In terminal 1 (Server):
```bash
npm run dev:server
```

In terminal 2 (Client):
```bash
npm run dev:client
```

The app should automatically open in your browser at `http://localhost:5173`

## Step 5: Test the Application

1. Click "Sign up" to create a new account
2. Enter an email and password (or use Google Sign-In)
3. You'll be redirected to the profile page
4. Check your Airtable base - a new record should appear!
5. Edit your profile (display name, phone, role)
6. Click "Save Changes"
7. Refresh Airtable to see the updates

## Troubleshooting

### "No response from server"
- Make sure the server is running on port 5000
- Check that `VITE_API_URL=http://localhost:5000` in `client/.env`

### "Failed to create user record"
- Verify your Airtable API key and Base ID are correct
- Make sure the table is named exactly `Users`
- Check that your token has `data.records:read` and `data.records:write` scopes

### "Invalid or expired token" from server
- Verify your Firebase service account credentials are correct
- Make sure the private key is wrapped in quotes and has `\n` characters
- Check that the project ID matches your Firebase project

### "Firebase: Error (auth/...)"
- Verify your Firebase Web SDK config is correct
- Make sure Email/Password and Google auth are enabled in Firebase Console
- Check that the API key is correct

### Port already in use
- Change `PORT=5000` to a different port in `server/.env`
- Update `VITE_API_URL` in `client/.env` to match

### Dependencies issues
```bash
# Clear and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm install
cd client && npm install
cd ../server && npm install
```

## Next Steps

Once everything is working:
1. Read `NextSteps.md` for enhancement ideas
2. Customize the UI to match your brand
3. Add additional fields to the Airtable Users table
4. Deploy to production (see README.md)

## Support

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check the server terminal for error messages
3. Verify all environment variables are set correctly
4. Review the README.md for detailed documentation

## Security Reminder

Never commit these files:
- `server/.env`
- `client/.env`
- Firebase service account JSON file

These are already in `.gitignore` for your protection.

---

Estimated total setup time: **15 minutes**

Happy coding!

