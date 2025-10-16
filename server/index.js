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
const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(
  process.env.AIRTABLE_BASE_ID
);
const usersTable = airtableBase(process.env.AIRTABLE_TABLE_NAME || 'Users');
const issuesTable = airtableBase(process.env.AIRTABLE_ISSUES_TABLE_NAME || 'Issues');
const userLogsTable = airtableBase(process.env.AIRTABLE_USER_LOGS_TABLE_NAME || 'UserLogs');

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
    console.error('Error finding user in Airtable:', error);
    if (error.statusCode === 403) {
      console.error('AUTHORIZATION ERROR: Check your Airtable token permissions!');
      console.error('   Your token needs:');
      console.error('   - data.records:read scope');
      console.error('   - data.records:write scope');
      console.error('   - Access to base:', process.env.AIRTABLE_BASE_ID);
    } else if (error.statusCode === 404) {
      console.error('BASE/TABLE NOT FOUND: Check your Base ID and table name');
      console.error('   Base ID:', process.env.AIRTABLE_BASE_ID);
      console.error('   Table Name:', process.env.AIRTABLE_TABLE_NAME);
    }
    throw error;
  }
};

// Helper function to find user by email
const findUserByEmail = async (email) => {
  try {
    const records = await usersTable
      .select({
        filterByFormula: `LOWER({email}) = LOWER('${email.replace(/'/g, "\\'")}')`,
        maxRecords: 1,
      })
      .firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error finding user by email in Airtable:', error);
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

// Helper function to log user updates to UserLogs table
const logUserUpdate = async (oldRecord, updatedFields) => {
  try {
    // Create a log entry with the current timestamp and all current profile values
    // We log the current state after the update (merging old values with updated ones)
    const logFields = {
      uid: oldRecord.fields.uid,
      email: oldRecord.fields.email,
      displayName: updatedFields.displayName !== undefined ? updatedFields.displayName : (oldRecord.fields.displayName || ''),
      phone: updatedFields.phone !== undefined ? updatedFields.phone : (oldRecord.fields.phone || ''),
      role: updatedFields.role !== undefined ? updatedFields.role : (oldRecord.fields.role || 'Parent'),
      timestamp: new Date().toISOString(),
    };

    // Create the log entry in UserLogs table
    await userLogsTable.create([
      {
        fields: logFields,
      },
    ]);

    console.log(`User update logged for ${oldRecord.fields.uid}: ${Object.keys(updatedFields).join(', ')}`);
  } catch (error) {
    console.error('Error logging user update:', error);
    // Don't throw error - logging failure shouldn't break the update operation
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// GET /api/check-email - Check if email exists in Airtable (public endpoint)
app.get('/api/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email parameter is required',
      });
    }

    const userRecord = await findUserByEmail(email);
    
    if (userRecord) {
      // User exists in Airtable
      // Try to get Firebase auth methods to determine login type
      let authProvider = 'unknown';
      try {
        const firebaseUser = await auth.getUserByEmail(email);
        // Check provider data to determine if it's Google or password
        if (firebaseUser.providerData && firebaseUser.providerData.length > 0) {
          const providers = firebaseUser.providerData.map(p => p.providerId);
          if (providers.includes('google.com')) {
            authProvider = 'google';
          } else if (providers.includes('password')) {
            authProvider = 'password';
          }
        }
      } catch (firebaseError) {
        // User exists in Airtable but not in Firebase yet
        console.log('User exists in Airtable but not in Firebase:', email);
        authProvider = 'none';
      }

      return res.json({
        exists: true,
        authProvider: authProvider,
        hasPassword: authProvider === 'password',
        hasGoogle: authProvider === 'google',
      });
    } else {
      // User doesn't exist
      return res.json({
        exists: false,
      });
    }
  } catch (error) {
    console.error('Email check error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check email',
      details: error.message,
    });
  }
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
    // Capitalize first letter and replace dots/underscores with spaces
    const formattedName = emailUsername
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create new user record in Airtable with default values
    const newRecord = await usersTable.create([
      {
        fields: {
          uid,
          email,
          displayName: formattedName,
          phone: '', // Empty phone initially
          role: 'Parent', // Default role
          // updatedAt is automatically set by Airtable (Last modified time field)
        },
      },
    ]);

    console.log(`New user created in Airtable: ${email} (${uid})`);

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

// PUT /api/profile - Update user profile (users cannot change their own role)
app.put('/api/profile', authenticateUser, async (req, res) => {
  try {
    const { uid } = req.user;
    const { displayName, phone } = req.body;

    // Find the user record
    const userRecord = await findUserByUID(uid);

    if (!userRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found',
      });
    }

    // Build update object with only provided fields (role is NOT allowed)
    const updateFields = {};
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (phone !== undefined) updateFields.phone = phone;

    // Update the record
    const updatedRecord = await usersTable.update([
      {
        id: userRecord.id,
        fields: updateFields,
      },
    ]);

    // Log the update to UserLogs table
    await logUserUpdate(userRecord, updateFields);

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

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await findUserByUID(uid);

    if (!userRecord || userRecord.fields.role !== 'Admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify admin status',
      details: error.message,
    });
  }
};

// GET /api/admin/users/search - Search users by email or name (Admin only)
app.get('/api/admin/users/search', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    const searchTerm = q.trim().toLowerCase();

    // Search by email or display name
    const records = await usersTable
      .select({
        filterByFormula: `OR(
          FIND('${searchTerm}', LOWER({email})) > 0,
          FIND('${searchTerm}', LOWER({displayName})) > 0
        )`,
      })
      .all();

    const users = records.map(formatUserRecord);
    
    // Deduplicate by uid in case there are duplicate records in Airtable
    const uniqueUsers = Array.from(
      new Map(users.map(user => [user.uid, user])).values()
    );
    
    console.log(`User search for "${searchTerm}": Found ${records.length} records, ${uniqueUsers.length} unique users`);

    return res.json({
      users: uniqueUsers,
      count: uniqueUsers.length,
    });
  } catch (error) {
    console.error('User search error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search users',
      details: error.message,
    });
  }
});

// PUT /api/admin/users/:uid - Update any user's profile (Admin only, cannot update self)
app.put('/api/admin/users/:uid', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { uid: targetUid } = req.params;
    const { uid: adminUid } = req.user;
    const { displayName, phone, role } = req.body;

    // Prevent admin from updating their own profile through admin endpoint
    if (targetUid === adminUid) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Cannot update your own profile through admin endpoint. Use /api/profile instead.',
      });
    }

    // Find the target user record
    const userRecord = await findUserByUID(targetUid);

    if (!userRecord) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (phone !== undefined) updateFields.phone = phone;
    if (role !== undefined) {
      // Validate role
      const validRoles = ['Parent', 'Educator', 'Admin', 'IT'];
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

    // Log the update to UserLogs table
    await logUserUpdate(userRecord, updateFields);

    console.log(`Admin ${adminUid} updated user ${targetUid}`);

    return res.json({
      message: 'User updated successfully',
      user: formatUserRecord(updatedRecord[0]),
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user',
      details: error.message,
    });
  }
});

// Middleware to check if user is IT or Admin
const requireITOrAdmin = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await findUserByUID(uid);

    if (!userRecord || !['IT', 'Admin'].includes(userRecord.fields.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'IT or Admin access required',
      });
    }

    req.userRole = userRecord.fields.role;
    next();
  } catch (error) {
    console.error('IT/Admin check error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify access level',
      details: error.message,
    });
  }
};

// POST /api/issues - Report an issue
app.post('/api/issues', authenticateUser, async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { issue, description } = req.body;

    if (!issue || !description) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Issue and description are required',
      });
    }

    // Get user's display name
    const userRecord = await findUserByUID(uid);
    const reportedBy = userRecord?.fields.displayName || email;

    // Create new issue record
    const newIssue = await issuesTable.create([
      {
        fields: {
          Issue: issue,
          Description: `${description}\n\n--- Reported by: ${reportedBy} (${email}) ---`,
          Resolved: false,
        },
      },
    ]);

    console.log(`New issue reported by ${email}: ${issue}`);

    return res.status(201).json({
      message: 'Issue reported successfully',
      issue: {
        id: newIssue[0].id,
        issue: newIssue[0].fields.Issue,
        description: newIssue[0].fields.Description,
        resolved: newIssue[0].fields.Resolved,
      },
    });
  } catch (error) {
    console.error('Issue creation error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to report issue',
      details: error.message,
    });
  }
});

// GET /api/issues - Get all issues (IT and Admin only)
app.get('/api/issues', authenticateUser, requireITOrAdmin, async (req, res) => {
  try {
    const { includeResolved } = req.query;

    let selectOptions = {};
    
    // Build filter formula to exclude blank records
    let filterFormulas = [];
    
    // Always exclude records where Issue field is blank
    filterFormulas.push('{Issue} != ""');
    
    // Add resolved filter if needed
    if (includeResolved !== 'true') {
      filterFormulas.push('{Resolved} = FALSE()');
    }
    
    // Combine filters with AND
    if (filterFormulas.length > 0) {
      selectOptions.filterByFormula = `AND(${filterFormulas.join(', ')})`;
    }

    // Note: Not sorting by Created field since it may not exist in all tables
    // Records will be returned in their default Airtable order

    const records = await issuesTable.select(selectOptions).all();

    // If no records, return empty array instead of failing
    if (!records || records.length === 0) {
      return res.json({
        issues: [],
        count: 0,
      });
    }

    // Map records and filter out any that still have blank Issue fields (extra safety)
    const issues = records
      .map((record) => ({
        id: record.id,
        issue: record.fields.Issue || '',
        description: record.fields.Description || '',
        resolved: record.fields.Resolved || false,
        createdAt: record.fields.Created || new Date().toISOString(),
      }))
      .filter(issue => issue.issue.trim() !== ''); // Extra safety to remove blanks

    return res.json({
      issues,
      count: issues.length,
    });
  } catch (error) {
    console.error('Issue fetch error:', error);
    console.error('Error details:', {
      statusCode: error.statusCode,
      message: error.message,
      error: error.error,
    });
    
    // If it's an Airtable table/field error, provide helpful message
    if (error.statusCode === 404) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'Issues table not found. Please check your Airtable configuration.',
        details: error.message,
      });
    }
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch issues',
      details: error.message,
    });
  }
});

// PUT /api/issues/:id/resolve - Mark issue as resolved (IT and Admin only)
app.put('/api/issues/:id/resolve', authenticateUser, requireITOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    // Update the issue
    const updatedIssue = await issuesTable.update([
      {
        id,
        fields: {
          Resolved: true,
        },
      },
    ]);

    console.log(`Issue ${id} resolved by ${email}`);

    return res.json({
      message: 'Issue marked as resolved',
      issue: {
        id: updatedIssue[0].id,
        issue: updatedIssue[0].fields.Issue,
        description: updatedIssue[0].fields.Description,
        resolved: updatedIssue[0].fields.Resolved,
      },
    });
  } catch (error) {
    console.error('Issue resolution error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to resolve issue',
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

// Test Airtable connection on startup
const testAirtableConnection = async () => {
  try {
    console.log('Testing Airtable connection...');
    const records = await usersTable.select({ maxRecords: 1 }).firstPage();
    console.log('Airtable connection successful!');
    console.log(`   Found ${records.length > 0 ? 'existing records' : 'empty table (ready for new users)'}`);
  } catch (error) {
    console.error('AIRTABLE CONNECTION FAILED!');
    console.error('   Error:', error.message);
    console.error('   Status:', error.statusCode);
    console.error('');
    console.error('TROUBLESHOOTING:');
    
    if (error.statusCode === 403) {
      console.error('   1. Go to: https://airtable.com/create/tokens');
      console.error('   2. Find your token and click Edit (or create new)');
      console.error('   3. Under "Access", make sure this base is selected:');
      console.error('      Base ID:', process.env.AIRTABLE_BASE_ID);
      console.error('   4. Make sure these scopes are checked:');
      console.error('      - data.records:read');
      console.error('      - data.records:write');
      console.error('   5. Save and copy the token (starts with "pat")');
      console.error('   6. Update AIRTABLE_PAT in server/.env');
      console.error('   7. Restart the server');
    } else if (error.statusCode === 404) {
      console.error('   1. Verify your Base ID:', process.env.AIRTABLE_BASE_ID);
      console.error('   2. Verify your table name:', process.env.AIRTABLE_TABLE_NAME);
      console.error('   3. Check that the table exists in Airtable');
    }
    console.error('');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log('=================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('=================================');
  console.log('Configuration Check:');
  console.log('Firebase Project ID:', process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Missing');
  console.log('Firebase Private Key:', process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Missing');
  console.log('Firebase Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Missing');
  
  // Check if using Personal Access Token (new format)
  const airtablePat = process.env.AIRTABLE_PAT;
  if (airtablePat) {
    if (airtablePat.startsWith('pat')) {
      console.log('Airtable PAT: Set (Personal Access Token)');
    } else if (airtablePat.startsWith('key')) {
      console.log('Airtable PAT: Set (OLD FORMAT - use Personal Access Token instead!)');
      console.log('   Create new token at: https://airtable.com/create/tokens');
    } else {
      console.log('Airtable PAT: Set (unknown format)');
    }
  } else {
    console.log('Airtable PAT: Missing');
  }
  
  console.log('Airtable Base ID:', process.env.AIRTABLE_BASE_ID || 'Missing');
  console.log('Airtable Table Name:', process.env.AIRTABLE_TABLE_NAME || 'Missing');
  console.log('=================================');
  
  // Test the Airtable connection
  await testAirtableConnection();
  console.log('=================================');
});

