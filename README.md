# CHE Dev Trial Project

A complete role-based web application with Firebase authentication and Airtable database integration. Features beautiful glassmorphism UI with animated backgrounds, real-time syncing, and comprehensive user management.

## Prerequisites

- Node.js 18+ installed
- Access to the Firebase project (already granted)
- Access to the Airtable base (already granted)
- A modern web browser

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd "CHE Dev Trial Project"

# Install all dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables

#### Server Environment (`server/.env`)

Create a file called `.env` in the `server` directory:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=fir-airtable-auth
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@fir-airtable-auth.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[Your Firebase private key here - ask project admin]
-----END PRIVATE KEY-----"

# Airtable Configuration
AIRTABLE_BASE_ID=appaRLpjx3EGZlgke
AIRTABLE_PAT=[Your Personal Access Token - ask project admin]
AIRTABLE_TABLE_NAME=Users
AIRTABLE_ISSUES_TABLE_NAME=Issues

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Client Environment (`client/.env`)

Create a file called `.env` in the `client` directory:

```env
# Firebase Web SDK Configuration
VITE_FIREBASE_API_KEY=[Your API key - ask project admin]
VITE_FIREBASE_AUTH_DOMAIN=fir-airtable-auth.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fir-airtable-auth
VITE_FIREBASE_STORAGE_BUCKET=fir-airtable-auth.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=[Your sender ID - ask project admin]
VITE_FIREBASE_APP_ID=[Your app ID - ask project admin]

# API Configuration
VITE_API_URL=http://localhost:5000

# Sync Interval (optional)
VITE_SYNC_INTERVAL=10000
```

### 3. Run the Application

```bash
# From project root - runs both client and server
npm run dev
```

The application will automatically open at **http://localhost:5173**

---

## Complete Feature List

### Authentication & Security
- ✅ **Email/Password Login** - Secure login with Firebase Auth
- ✅ **Email/Password Signup** - Create new accounts with validation
- ✅ **Google OAuth** - Sign in/up with Google account
- ✅ **Auto-Login Persistence** - Stays logged in across browser sessions
- ✅ **Session Management** - 5-minute minimum session with activity tracking
- ✅ **Smart Account Detection** - Automatically detects if account uses Google or password
- ✅ **Auto-Redirect on Invalid Login** - Prefills signup form if account doesn't exist
- ✅ **Email Validation** - Validates email format (user@domain.com)
- ✅ **Phone Validation** - Supports multiple phone formats internationally
- ✅ **Token Verification** - Server-side Firebase token validation on all API calls
- ✅ **Protected Routes** - Redirects to login if not authenticated
- ✅ **Role-Based Access Control** - Different permissions for each role

### User Roles & Portals
- ✅ **4 User Roles** - Parent, Educator, Admin, IT
- ✅ **Parent Portal** - Dedicated interface for parents
- ✅ **Educator Portal** - Dedicated interface for educators
- ✅ **Admin Portal** - Full system management capabilities
- ✅ **IT Portal** - Technical support and issue management
- ✅ **Smart Dashboard** - Auto-routes to appropriate portal based on role
- ✅ **Role-Based UI** - Each portal shows role-specific features

### Profile Management
- ✅ **View Profile** - See all profile information
- ✅ **Edit Display Name** - Update how your name appears
- ✅ **Edit Phone Number** - Update contact information
- ✅ **View Role** - See your assigned role
- ✅ **Profile Page** - Dedicated page for profile management
- ✅ **Real-Time Sync** - Profile changes sync with Airtable automatically
- ✅ **Pending Profile Data** - New signups can add name/phone during registration
- ✅ **Auto-Bootstrap** - First login creates Airtable record automatically

### Admin Features
- ✅ **User Search** - Search all users by email or name
- ✅ **Edit User Profiles** - Modify any user's display name, phone, or role
- ✅ **Role Assignment** - Change user roles (Parent, Educator, Admin, IT)
- ✅ **Admin Protection** - Cannot edit own profile through admin tools
- ✅ **Duplicate Prevention** - Automatically removes duplicate search results
- ✅ **User Management Dashboard** - Centralized user administration
- ✅ **View IT Tickets** - Access to all system issues

### IT Ticket System
- ✅ **Submit Tickets** - Parents and Educators can report issues
- ✅ **Issue Tracking** - Full issue/description storage
- ✅ **View All Issues** - IT and Admin can see all tickets
- ✅ **Filter by Status** - Toggle between open and resolved tickets
- ✅ **Mark Resolved** - IT and Admin can close tickets
- ✅ **Auto-Attribution** - System automatically logs who submitted each ticket
- ✅ **Real-Time Updates** - Issues sync every 5 seconds
- ✅ **Issue Statistics** - Count of open, resolved, and total issues
- ✅ **Blank Record Filtering** - Ignores empty database entries

### UI/UX Features
- ✅ **Glassmorphism Design** - Modern frosted glass card effects
- ✅ **Animated Backgrounds** - 6 floating pastel blobs with physics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Loading States** - Clear feedback during operations
- ✅ **Error Notifications** - User-friendly error messages
- ✅ **Success Messages** - Confirmation of successful actions
- ✅ **Sync Indicators** - Shows when data is syncing with database
- ✅ **Loading Spinners** - Visual feedback for async operations
- ✅ **Form Validation** - Real-time input validation
- ✅ **Hover Effects** - Interactive button and card states
- ✅ **Smooth Transitions** - Polished animations throughout
- ✅ **Custom Components** - Reusable Button, Input, Select, GlassCard components

### Database Integration
- ✅ **Airtable Users Table** - Stores all user profile data
- ✅ **Airtable Issues Table** - Stores IT tickets
- ✅ **Real-Time Polling** - Background sync every 10 seconds for profiles
- ✅ **Real-Time Polling** - Background sync every 5 seconds for issues
- ✅ **Optimistic Updates** - UI updates immediately, syncs in background
- ✅ **Error Recovery** - Graceful handling of sync failures
- ✅ **Connection Testing** - Validates Airtable connection on server start
- ✅ **Query Filtering** - Server-side data filtering for performance
- ✅ **Deduplication** - Removes duplicate records automatically

### Developer Experience
- ✅ **Hot Module Replacement** - Instant updates during development
- ✅ **Concurrent Dev Mode** - Runs client and server together
- ✅ **Console Logging** - Detailed logs for debugging
- ✅ **Error Details** - Comprehensive error information
- ✅ **Environment Variables** - Secure credential management
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Context API** - Centralized state management
- ✅ **API Service Layer** - Axios with interceptors

---

## Functionality Testing Checklist

### Authentication Tests

**Email/Password Authentication:**
- [ ] Create account with email and password
- [ ] Log out and log back in with same credentials
- [ ] Try logging in with wrong password (should show error)
- [ ] Try logging in with non-existent email (should redirect to signup with email prefilled)
- [ ] Close browser and reopen - should stay logged in
- [ ] Refresh page while logged in - should stay logged in

**Google Authentication:**
- [ ] Sign in with Google account
- [ ] Verify profile is created in Airtable
- [ ] Log out and sign in with Google again
- [ ] Try logging in with email/password for a Google account (should suggest Google login)
- [ ] Close browser and reopen - should stay logged in

**Account Detection:**
- [ ] Create account with email/password
- [ ] Log out, then try to create another account with same email (should show error)
- [ ] Try logging in with password for a Google-only account (should suggest Google)

### Profile Management Tests

**View and Edit Profile:**
- [ ] Navigate to "My Profile" page
- [ ] View current profile information
- [ ] Update display name and save
- [ ] Update phone number and save
- [ ] Verify changes appear in Airtable Users table
- [ ] Refresh page - changes should persist

**Profile During Signup:**
- [ ] Sign up with new email
- [ ] Add display name during signup
- [ ] Add phone number during signup
- [ ] Verify information appears in profile after login

### Role-Based Portal Tests

**Parent Portal:**
- [ ] Log in as Parent role user
- [ ] Verify you see Parent Portal
- [ ] Submit an IT ticket
- [ ] Verify ticket appears in Airtable Issues table

**Educator Portal:**
- [ ] Log in as Educator role user
- [ ] Verify you see Educator Portal
- [ ] Submit an IT ticket
- [ ] Verify ticket appears in Airtable Issues table

**Admin Portal:**
- [ ] Log in as Admin role user
- [ ] Verify you see Admin Portal
- [ ] View system error logs section
- [ ] Expand error logs and see IT tickets

**IT Portal:**
- [ ] Log in as IT role user
- [ ] Verify you see IT Portal
- [ ] View issue statistics (open/resolved/total)
- [ ] See list of open issues

### Admin Features Tests

**User Search:**
- [ ] Go to Admin Portal
- [ ] Search for user by email
- [ ] Search for user by name
- [ ] Verify no duplicate results appear
- [ ] Try searching with no results

**User Management:**
- [ ] Search for a user
- [ ] Click "Edit" on a user (not yourself)
- [ ] Change user's display name
- [ ] Change user's phone number
- [ ] Change user's role
- [ ] Save changes
- [ ] Verify changes in Airtable Users table
- [ ] Try to edit your own profile (should be disabled)

### IT Ticket System Tests

**Submit Tickets (as Parent/Educator):**
- [ ] Log in as Parent or Educator
- [ ] Scroll to "Submit IT Ticket" section
- [ ] Enter issue summary
- [ ] Enter detailed description
- [ ] Submit ticket
- [ ] Verify success message
- [ ] Check Airtable Issues table for new ticket

**Manage Tickets (as IT/Admin):**
- [ ] Log in as IT or Admin
- [ ] View list of open issues
- [ ] Check issue statistics are correct
- [ ] Toggle "Show All" to see resolved issues
- [ ] Click "Mark Resolved" on an issue
- [ ] Verify issue disappears from open list
- [ ] Check Airtable - issue should be marked resolved

**Real-Time Sync:**
- [ ] Open IT Portal
- [ ] In another window, manually add issue to Airtable
- [ ] Wait 5 seconds
- [ ] Verify new issue appears automatically
- [ ] Watch for "Syncing with database..." indicator

### UI/UX Tests

**Visual Elements:**
- [ ] Verify animated pastel blobs in background
- [ ] Verify glassmorphism cards are semi-transparent
- [ ] Hover over buttons - should show hover effects
- [ ] Verify loading spinners appear during operations
- [ ] Check sync indicator appears during background syncs

**Responsive Design:**
- [ ] Test on desktop (full screen)
- [ ] Test on tablet size (resize browser)
- [ ] Test on mobile size (resize browser)
- [ ] Verify all elements remain accessible

**Error Handling:**
- [ ] Try submitting form with empty required fields
- [ ] Try invalid email format
- [ ] Try invalid phone format
- [ ] Verify error messages are clear and helpful
- [ ] Stop server and try to load data (should show error)

### Session & Persistence Tests

**Session Behavior:**
- [ ] Log in and interact with app (click, scroll)
- [ ] Wait 5 minutes without activity
- [ ] Interact again - should still be logged in
- [ ] Close browser tab
- [ ] Reopen and navigate to site - should be logged in
- [ ] Log out manually
- [ ] Try accessing protected pages - should redirect to login

---

**Email/Password Authentication:**
- [ ] Create account with email and password
- [ ] Log out and log back in with same credentials
- [ ] Try logging in with wrong password (should show error)
- [ ] Try logging in with non-existent email (should redirect to signup with email prefilled)
- [ ] Close browser and reopen - should stay logged in
- [ ] Refresh page while logged in - should stay logged in

**Google Authentication:**
- [ ] Sign in with Google account
- [ ] Verify profile is created in Airtable
- [ ] Log out and sign in with Google again
- [ ] Try logging in with email/password for a Google account (should suggest Google login)
- [ ] Close browser and reopen - should stay logged in

**Account Detection:**
- [ ] Create account with email/password
- [ ] Log out, then try to create another account with same email (should show error)
- [ ] Try logging in with password for a Google-only account (should suggest Google)

### Profile Management Tests

**View and Edit Profile:**
- [ ] Navigate to "My Profile" page
- [ ] View current profile information
- [ ] Update display name and save
- [ ] Update phone number and save
- [ ] Verify changes appear in Airtable Users table
- [ ] Refresh page - changes should persist

**Profile During Signup:**
- [ ] Sign up with new email
- [ ] Add display name during signup
- [ ] Add phone number during signup
- [ ] Verify information appears in profile after login

### Role-Based Portal Tests

**Parent Portal:**
- [ ] Log in as Parent role user
- [ ] Verify you see Parent Portal
- [ ] Submit an IT ticket
- [ ] Verify ticket appears in Airtable Issues table

**Educator Portal:**
- [ ] Log in as Educator role user
- [ ] Verify you see Educator Portal
- [ ] Submit an IT ticket
- [ ] Verify ticket appears in Airtable Issues table

**Admin Portal:**
- [ ] Log in as Admin role user
- [ ] Verify you see Admin Portal
- [ ] View system error logs section
- [ ] Expand error logs and see IT tickets

**IT Portal:**
- [ ] Log in as IT role user
- [ ] Verify you see IT Portal
- [ ] View issue statistics (open/resolved/total)
- [ ] See list of open issues

### Admin Features Tests

**User Search:**
- [ ] Go to Admin Portal
- [ ] Search for user by email
- [ ] Search for user by name
- [ ] Verify no duplicate results appear
- [ ] Try searching with no results

**User Management:**
- [ ] Search for a user
- [ ] Click "Edit" on a user (not yourself)
- [ ] Change user's display name
- [ ] Change user's phone number
- [ ] Change user's role
- [ ] Save changes
- [ ] Verify changes in Airtable Users table
- [ ] Try to edit your own profile (should be disabled)

### IT Ticket System Tests

**Submit Tickets (as Parent/Educator):**
- [ ] Log in as Parent or Educator
- [ ] Scroll to "Submit IT Ticket" section
- [ ] Enter issue summary
- [ ] Enter detailed description
- [ ] Submit ticket
- [ ] Verify success message
- [ ] Check Airtable Issues table for new ticket

**Manage Tickets (as IT/Admin):**
- [ ] Log in as IT or Admin
- [ ] View list of open issues
- [ ] Check issue statistics are correct
- [ ] Toggle "Show All" to see resolved issues
- [ ] Click "Mark Resolved" on an issue
- [ ] Verify issue disappears from open list
- [ ] Check Airtable - issue should be marked resolved

**Real-Time Sync:**
- [ ] Open IT Portal
- [ ] In another window, manually add issue to Airtable
- [ ] Wait 5 seconds
- [ ] Verify new issue appears automatically
- [ ] Watch for "Syncing with database..." indicator

### Session & Persistence Tests


---

## Project Structure

```
CHE Dev Trial Project/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── AdminUserManagement.jsx
│   │   │   ├── BackgroundBlobs.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── SubmitTicket.jsx
│   │   │   ├── IssuesList.jsx
│   │   │   └── ... (other components)
│   │   ├── pages/          # Main application pages
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ParentPortal.jsx
│   │   │   ├── EducatorPortal.jsx
│   │   │   ├── AdminPortal.jsx
│   │   │   └── ITPortal.jsx
│   │   ├── contexts/       # React Context for state
│   │   │   ├── AuthContext.jsx
│   │   │   └── ErrorContext.jsx
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   └── config/         # Firebase configuration
│   │       └── firebase.js
│   ├── .env               # Client environment variables
│   └── package.json
│
├── server/                # Express Backend
│   ├── index.js          # API endpoints and middleware
│   ├── .env             # Server environment variables
│   └── package.json
│
└── package.json          # Root workspace scripts
```

## API Endpoints Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Health check |
| GET | `/api/check-email` | Public | Check if email exists in database |
| POST | `/api/bootstrap` | Authenticated | Create/get user on first login |
| GET | `/api/profile` | Authenticated | Get current user profile |
| PUT | `/api/profile` | Authenticated | Update own profile |
| GET | `/api/admin/users/search` | Admin | Search all users |
| PUT | `/api/admin/users/:uid` | Admin | Update any user profile |
| POST | `/api/issues` | Authenticated | Submit IT ticket |
| GET | `/api/issues` | IT/Admin | Get all issues |
| PUT | `/api/issues/:id/resolve` | IT/Admin | Mark issue resolved |

## Technology Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Firebase Web SDK
- React Router v6
- Axios

**Backend:**
- Node.js 18+
- Express
- Firebase Admin SDK
- Airtable.js
- CORS
- dotenv

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Server won't start | Check `server/.env` exists and has all required variables |
| "No response from server" | Verify server is running on port 5000 |
| Authentication fails | Check Firebase credentials in `client/.env` |
| Airtable errors | Verify PAT and Base ID in `server/.env` |
| Port 5000 in use | Change PORT in `server/.env`, update VITE_API_URL in `client/.env` |
| Can't log in | Clear browser cache, check Firebase console for user |
| Issues not loading | Verify Issues table exists in Airtable with correct name |

## Support

For issues or questions:
1. Check browser console (F12) for errors
2. Check server terminal for API errors
3. Verify all environment variables are set correctly
4. Ensure Firebase and Airtable credentials are valid

---
