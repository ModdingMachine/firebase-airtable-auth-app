import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import Airtable from 'airtable';

dotenv.config();

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const auth = getAuth();

// Initialize Airtable
const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const usersTable = airtableBase(process.env.AIRTABLE_TABLE_NAME || 'Users');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware - verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No valid authorization token provided' 
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired token' 
    });
  }
};

// Helper function to find user by UID
const findUserByUID = async (uid) => {
  try {
    const records = await usersTable
      .select({
        filterByFormula: `{uid} = '${uid}'`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

// Helper function to format user record
const formatUserRecord = (record) => {
  return {
    id: record.id,
    uid: record.fields.uid,
    email: record.fields.email,
    displayName: record.fields.displayName || '',
    phone: record.fields.phone || '',
    role: record.fields.role || '',
    updatedAt: record.fields.updatedAt,
  };
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// POST /api/bootstrap - Create or get user on first login
app.post('/api/bootstrap', authenticateUser, async (req, res) => {
  try {
    const { uid, email } = req.user;

    // Check if user already exists
    let existingUser = await findUserByUID(uid);

    if (existingUser) {
      return res.json({
        message: 'User already exists',
        user: formatUserRecord(existingUser),
      });
    }

    // Extract name from email for default display name
    const emailUsername = email.split('@')[0];
    const defaultDisplayName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);

    // Create new user record in Airtable with default values
    const newRecord = await usersTable.create([
      {
        fields: {
          uid,
          email,
          displayName: defaultDisplayName,
          phone: '', // Empty phone initially
          role: 'Parent', // Default role
          // updatedAt is automatically set by Airtable (Last modified time field)
        },
      },
    ]);

    console.log(`New user created: ${email} (${uid})`);

    return res.status(201).json({
      message: 'User created successfully',
      user: formatUserRecord(newRecord[0]),
    });
  } catch (error) {
    console.error('Bootstrap error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create or retrieve user record',
      details: error.message,
    });
  }
});

// GET /api/profile - Get current user's profile
app.get('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;

    const userRecord = await findUserByUID(uid);

    if (!userRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found',
      });
    }

    return res.json({
      user: formatUserRecord(userRecord),
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user profile',
      details: error.message,
    });
  }
});

// PUT /api/profile - Update user profile
app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const { displayName, phone, role } = req.body;

    // Find the user record
    const userRecord = await findUserByUID(uid);

    if (!userRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found',
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (phone !== undefined) updateFields.phone = phone;
    if (role !== undefined) {
      // Validate role
      const validRoles = ['Parent', 'Educator', 'Admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        });
      }
      updateFields.role = role;
    }

    // Update the record
    const updatedRecord = await usersTable.update([
      {
        id: userRecord.id,
        fields: updateFields,
      },
    ]);

    return res.json({
      message: 'Profile updated successfully',
      user: formatUserRecord(updatedRecord[0]),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user profile',
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});

