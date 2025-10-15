# CHE Dev Trial Project

A complete role-based web application with Firebase authentication and Airtable database integration.

## Prerequisites

- Node.js 18+ installed
- Access to the Firebase project
- Access to the Airtable base
- A modern web browser

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd "CHE Dev Trial Project"

# Install dependencies
npm install
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
- Email/password login and signup
- Google account login and signup
- Sessions persist across browser restarts
- Minimum 5-minute session length with activity tracking
- Detects and handles whether account uses Google or password
- Prefills signup if account does not exist on login attempt
- Validates email and phone formats
- All API calls require valid, server-verified Firebase tokens
- Protected routes (redirect if not authenticated)
- Access control based on user role

### User Roles & Portals
- Four user roles: Parent, Educator, Admin, IT
- Each role has a dedicated portal/interface
- Dashboard automatically routes to the right portal based on role
- UI features shown depend on user role

### Profile Management
- View and edit your profile (display name, phone, role)
- See your current role
- Real-time sync of profile changes with Airtable
- New signups can provide name and phone at registration
- Airtable record created automatically on first login

### Admin Features
- Search and manage all users
- Edit user display name, phone, and role (except your own as admin)
- Change roles between Parent, Educator, Admin, and IT
- Duplicate users are automatically filtered out of results
- Dashboard for centralized user management
- Admins can view all IT tickets

### IT Ticket System
- Parents and Educators can submit IT tickets with descriptions
- All issues tracked and stored
- IT and Admin roles can view and manage all tickets
- Filter tickets by open/resolved status
- IT and Admin can mark issues resolved
- Each ticket records who submitted it
- Issue list updates in real time (every 5 seconds)
- Shows counts of open, resolved, and total issues
- Ignores any empty/blank issues from the database

### UI/UX Features
- Modern design with frosted glass cards and animated backgrounds
- Responsive layout (desktop, tablet, mobile)
- Loading states and indicators, error and success messages
- Sync status shown in UI
- Spinners for async actions
- Real-time validation for forms
- Hover effects and smooth animations
- Custom reusable UI components

### Database Integration
- Uses Airtable for users and issues/tickets
- Profiles synced every 10 seconds, issues every 5 seconds
- UI updates immediately on change, data syncs in the background
- System recovers gracefully from sync errors
- Airtable connection is validated at server start
- Server filters and deduplicates records for performance

### Developer Experience
- Hot reload for front and back end
- Client and server can be run together in development
- Console logging and error details for debugging
- Uses environment variables for credentials and config
- Modular, maintainable code structure with separation of concerns
- Centralized state with Context API
- API calls managed through Axios service layer

---

#### Test Accounts for Feature Testing

| Username            | Password |
|---------------------|----------|
| parent@test.com     | password |
| educator@test.com   | password |
| admin@test.com      | password |
| it@test.com         | password |


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
