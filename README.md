# Firebase Airtable Authentication App

A modern web application featuring Firebase authentication (Email/Password and Google Sign-In) with Airtable for user profile storage. Built with React, Vite, Express, and styled with the "Plastic Fantastic" design system.

## Features

- Firebase Authentication (Email/Password + Google Sign-In)
- Airtable user profile storage
- Protected profile page with editable fields
- Automatic user record creation on first login
- Clean, modern UI with glassmorphism effects
- Secure Express API proxy for Airtable

## Project Structure

```
firebase-airtable-auth-app/
├── client/          # Vite React frontend
├── server/          # Express API backend
├── package.json     # Root workspace configuration
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication enabled
- Airtable account with a base set up
- GitHub account (for repository creation)

## Setup Instructions

### 1. Airtable Setup

1. Create a free Airtable account at https://airtable.com
2. Create a new base
3. Create a table named `Users` with these fields:
   - `uid` (Single line text, required, unique)
   - `email` (Email)
   - `displayName` (Single line text)
   - `phone` (Phone number)
   - `role` (Single select: Parent, Educator, Admin)
   - `updatedAt` (Last modified time)
4. Generate a Personal Access Token:
   - Go to https://airtable.com/create/tokens
   - Create a token with `data.records:read` and `data.records:write` scopes
   - Select your base
   - Copy the token
5. Get your Base ID:
   - Go to https://airtable.com/api
   - Select your base
   - The Base ID starts with "app..." (found in the URL or docs)

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (add your support email)
3. Get Web SDK Configuration:
   - Project Settings > General
   - Scroll to "Your apps" > Web app
   - Copy the config object
4. Create Service Account (for backend):
   - Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file securely (don't commit it!)

### 3. Environment Configuration

#### Server Environment (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Airtable
AIRTABLE_API_KEY=your-personal-access-token
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Users
```

**Note:** For `FIREBASE_PRIVATE_KEY`, copy the entire private key from your service account JSON, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts. Make sure it's wrapped in quotes and preserve the `\n` characters.

#### Client Environment (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

VITE_API_URL=http://localhost:5000
```

### 4. Installation

From the root directory:

```bash
# Install all dependencies (root, client, and server)
npm run install:all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Running the Application

From the root directory:

```bash
# Run both client and server concurrently
npm run dev
```

Or run them separately in different terminals:

```bash
# Terminal 1 - Server (runs on http://localhost:5000)
npm run dev:server

# Terminal 2 - Client (runs on http://localhost:5173)
npm run dev:client
```

The app will open in your browser at `http://localhost:5173`

## Usage

### First Time Login

1. Create an account using email/password or Google Sign-In
2. The app automatically creates a user record in Airtable with your Firebase UID
3. You'll be redirected to your profile page

### Profile Page

- View your email, display name, phone, and role
- Edit your display name, phone, and role
- Changes are saved directly to Airtable
- Click "Logout" to sign out

## API Endpoints

### `POST /api/bootstrap`
Creates or retrieves user record on first login
- Headers: `Authorization: Bearer <firebase-id-token>`
- Returns: User object from Airtable

### `GET /api/profile`
Retrieves current user's profile
- Headers: `Authorization: Bearer <firebase-id-token>`
- Returns: User object

### `PUT /api/profile`
Updates user profile fields
- Headers: `Authorization: Bearer <firebase-id-token>`
- Body: `{ displayName?, phone?, role? }`
- Returns: Updated user object

## Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Firebase Web SDK (v10)
- React Router
- Axios

**Backend:**
- Node.js
- Express
- Firebase Admin SDK
- Airtable.js
- CORS

## Design System

The UI follows the "Plastic Fantastic" style guide featuring:
- Soft pastel color palette (#a2d2ff, #ffafcc, #bde0fe)
- Glassmorphism cards with backdrop blur
- Nunito font family
- Smooth animations and transitions
- Responsive design

## Security Notes

- Never commit `.env` files or Firebase service account JSON
- ID tokens are verified on the backend using Firebase Admin SDK
- All API endpoints require valid Firebase authentication
- CORS is configured for localhost development

## Troubleshooting

**Port already in use:**
- Change the `PORT` in `server/.env` to a different value
- Update `VITE_API_URL` in `client/.env` accordingly

**Firebase authentication errors:**
- Verify your API keys are correct
- Ensure Email/Password and/or Google are enabled in Firebase Console
- Check that authorized domains include `localhost`

**Airtable connection errors:**
- Verify your Personal Access Token has proper scopes
- Check Base ID is correct (starts with "app...")
- Ensure table name is exactly "Users"

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Next Steps

See `NextSteps.md` for ideas on extending this application.

## License

MIT

