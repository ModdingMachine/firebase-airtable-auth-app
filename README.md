# Firebase Airtable Authentication App

A complete, production-ready web application featuring Firebase authentication with Airtable for user profile storage. Built with React, Vite, Express, and styled with the beautiful "Plastic Fantastic" design system featuring glassmorphism effects.

**GitHub Repository**: https://github.com/ModdingMachine/firebase-airtable-auth-app

## Quick Start

**IMPORTANT**: This app requires Firebase and Airtable credentials to function. Follow the setup guide before running.

### 1. Set Up Credentials (15 minutes)
See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed instructions on:
- Creating an Airtable base and getting your API credentials
- Setting up Firebase authentication and service account
- Configuring environment variables

### 2. Create Environment Files
```bash
# Create server/.env (see server/.env.example for template)
# Create client/.env (see client/.env.example for template)
```

### 3. Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 4. Run the Application
```bash
# From project root - runs both client and server
npm run dev
```

The app will open automatically at **http://localhost:5173**

## Features

- **Authentication**: Email/Password sign-up/login + Google Sign-In
- **User Profiles**: Stored in Airtable with editable fields (displayName, phone, role)
- **Auto-Bootstrap**: First login automatically creates user record in Airtable
- **Protected Routes**: Must be authenticated to access profile
- **Beautiful UI**: Glassmorphism design with parallax background effects
- **Responsive**: Mobile-friendly design
- **Secure API**: Bearer token authentication with Firebase Admin SDK
- **Error Handling**: Clear error messages and loading states

## Project Structure

```
firebase-airtable-auth-app/
├── client/              # Vite React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components (GlassCard, Button, etc.)
│   │   ├── pages/       # Login, Signup, Profile pages
│   │   ├── contexts/    # AuthContext for state management
│   │   ├── services/    # API service layer (axios)
│   │   └── config/      # Firebase Web SDK configuration
│   ├── .env             # Client environment variables (create this)
│   └── package.json
│
├── server/              # Express API backend
│   ├── index.js         # API endpoints and auth middleware
│   ├── .env             # Server environment variables (create this)
│   └── package.json
│
├── SETUP_GUIDE.md       # Detailed setup instructions
├── NextSteps.md         # Ideas for extending the app
├── README.md            # This file
└── package.json         # Root workspace configuration
```

## What You Have

A complete web application with:
- Beautiful "Plastic Fantastic" UI with glassmorphism effects
- Firebase authentication (Email/Password + Google Sign-In)
- Airtable database for user profiles
- Secure Express API backend
- React frontend with Vite hot reload
- Clean, maintainable code architecture

## Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Airtable account (free tier works)
- Git and GitHub account
- A web browser

## Architecture

### High-Level Overview
```
Client (React + Vite)
    ↓ Firebase Auth (Web SDK)
    ↓ Authenticated requests with ID token
Express API Server
    ↓ Verifies Firebase ID token
    ↓ Proxies requests
Airtable REST API
```

### Why This Architecture?

**Security**: Firebase ID tokens are verified server-side, ensuring only authenticated users can access Airtable data.

**Separation**: Frontend never directly accesses Airtable, keeping your API keys secure.

**Simplicity**: All in one local folder, easy to understand and modify.

## Setup Instructions

For detailed step-by-step instructions, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

### Quick Setup Summary

#### 1. Airtable Setup

- Create free Airtable account and base
- Create "Users" table with fields: uid, email, displayName, phone, role, updatedAt
- Generate Personal Access Token
- Get your Base ID

#### 2. Firebase Setup
- Create Firebase project
- Enable Email/Password and Google authentication
- Get Web SDK configuration
- Create service account JSON for backend

#### 3. Configure Environment Variables
- Create `server/.env` with Firebase and Airtable credentials
- Create `client/.env` with Firebase Web SDK config
- See `.env.example` files for templates

#### 4. Install & Run
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
npm run dev  # Runs both client and server
```

## Usage

### Testing Your Setup

1. **Sign Up**: Create a new account with email/password or Google
2. **Check Airtable**: Verify a new record was created automatically
3. **Edit Profile**: Update your display name, phone, and role
4. **Verify Update**: Check Airtable to see the changes
5. **Logout & Login**: Test the authentication flow
6. **Try Google Sign-In**: Test alternative authentication method

### User Flow

1. **First Visit**: User lands on login page
2. **Sign Up**: User creates account (email/password or Google)
3. **Auto-Bootstrap**: Backend automatically creates Airtable record with Firebase UID
4. **Profile Page**: User can view and edit their profile
5. **Updates**: Changes save directly to Airtable
6. **Logout**: User can logout and login again

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

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool with super-fast HMR
- **TailwindCSS** - Utility-first CSS with custom theme
- **Firebase Web SDK v10** - Authentication
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management

### Backend
- **Node.js 18+** - Runtime
- **Express** - Web framework
- **Firebase Admin SDK** - Token verification
- **Airtable.js** - Database SDK
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Design System: "Plastic Fantastic"

The UI features a modern glassmorphism aesthetic:
- **Colors**: Soft pastels (#a2d2ff, #ffafcc, #bde0fe) on light blue-gray (#f0f4f8)
- **Typography**: Nunito font family (400, 700, 800 weights)
- **Effects**: Glassmorphism cards with backdrop blur and subtle shadows
- **Animations**: Smooth transitions, parallax background blobs
- **Responsive**: Mobile-first design approach

## Security

### Best Practices Implemented

- **Token Verification**: All API requests verify Firebase ID tokens server-side
- **Environment Variables**: Sensitive credentials stored in `.env` files (gitignored)
- **No Direct Database Access**: Frontend never directly accesses Airtable
- **CORS Protection**: Configured for specific origins only
- **Password Requirements**: Minimum 6 characters enforced by Firebase
- **HTTPS Ready**: Works with SSL/TLS in production

### Security Checklist

- ✅ Never commit `.env` files
- ✅ Never commit Firebase service account JSON
- ✅ Use environment variables for all secrets
- ✅ Verify ID tokens on every API request
- ✅ Keep dependencies updated
- ✅ Use HTTPS in production
- ✅ Configure Firebase security rules
- ✅ Limit Airtable token permissions

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "No response from server" | Verify server is running on port 5000 and `server/.env` exists |
| Firebase auth errors | Check Firebase credentials in `client/.env` and auth methods enabled |
| Airtable connection fails | Verify API key, Base ID, and table name in `server/.env` |
| Port already in use | Change PORT in `server/.env` and update `VITE_API_URL` in `client/.env` |
| Dependencies issues | Delete `node_modules` folders and reinstall |
| Invalid token error | Check Firebase service account credentials in `server/.env` |

### Debug Mode

Enable detailed logging:
```bash
# In server/.env
NODE_ENV=development

# Check browser console (F12)
# Check server terminal output
```

For more help, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)** Troubleshooting section.

## Development Scripts

```bash
# Root directory
npm run dev            # Run both client and server
npm run dev:client     # Run client only
npm run dev:server     # Run server only
npm run install:all    # Install all dependencies
npm run build          # Build client for production

# Server directory
npm run dev            # Run with nodemon (auto-restart)
npm start              # Run in production mode

# Client directory
npm run dev            # Run dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

## Extending the App

This project is designed to be easily extended. See **[NextSteps.md](NextSteps.md)** for ideas:

### Quick Wins
- Password reset functionality
- Email verification
- Form validation improvements
- User avatars
- Dark mode

### Advanced Features
- Multi-factor authentication
- Admin dashboard
- User search and directory
- Real-time updates
- Notifications system
- Multi-language support

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `client/dist` folder
3. Set environment variables in hosting dashboard

### Backend (Railway/Render/Heroku)
1. Push to a separate repo or monorepo
2. Set environment variables
3. Ensure `NODE_ENV=production`
4. Update `VITE_API_URL` in client to point to production API

### Environment Variables for Production
- Update Firebase authorized domains
- Use production Airtable base
- Enable HTTPS
- Configure CORS for production domain

## Contributing

Feel free to submit issues and enhancement requests!

### Development Guidelines
- Follow existing code style
- Use meaningful commit messages
- Test changes thoroughly
- Update documentation as needed

## Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Airtable API**: https://airtable.com/developers/web/api/introduction
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com

## Support

- Read **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed setup help
- Check **[NextSteps.md](NextSteps.md)** for enhancement ideas
- Review GitHub Issues for common problems
- Check browser console (F12) for client errors
- Check server terminal for API errors

## License

MIT

---

**Built with ❤️ using Firebase, Airtable, React, and the Plastic Fantastic design system**

**Estimated setup time**: 15 minutes | **Estimated build time**: Production-ready out of the box

