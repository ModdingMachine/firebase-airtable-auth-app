# Fixing Airtable Authorization Error (403)

If you're seeing `NOT_AUTHORIZED` or `403` errors, your Airtable Personal Access Token needs to be configured correctly.

## Step-by-Step Fix

### 1. Go to Airtable Token Management
Visit: https://airtable.com/create/tokens

### 2. Delete Old Token (if exists)
- Find your existing token in the list
- Click the three dots (•••) next to it
- Select "Delete token"
- Confirm deletion

### 3. Create New Token with Correct Permissions

Click **"Create new token"**

#### A. Give it a name
- Example: `Firebase Auth App Token`

#### B. Add Scopes (REQUIRED)
Check these boxes:
- ✅ `data.records:read` - Read records from tables
- ✅ `data.records:write` - Create, update, and delete records

**IMPORTANT**: You need BOTH scopes!

#### C. Add Access to Your Base
1. Under "Access", click **"Add a base"**
2. Find and select your base (the one with the Users table)
3. Make sure it's checked

#### D. Create Token
1. Click **"Create token"**
2. Copy the token immediately (starts with `pat...`)
3. You won't be able to see it again!

### 4. Update Your Server .env File

Open `server/.env` and update:

```env
AIRTABLE_API_KEY=patYourNewTokenHere123456789
```

**Note**: The token should start with `pat` (Personal Access Token)

### 5. Verify Your Base ID

Your Base ID should start with `app`. To find it:

1. Go to https://airtable.com/api
2. Click on your base
3. The Base ID is shown in the introduction section
4. It looks like: `appXXXXXXXXXXXXXX`

Update in `server/.env`:
```env
AIRTABLE_BASE_ID=appYourBaseIdHere
```

### 6. Verify Table Name

Make sure your table is named exactly: `Users` (case-sensitive!)

In Airtable:
- Click on the table tab at the top
- If it's not named "Users", right-click and rename it

Update in `server/.env`:
```env
AIRTABLE_TABLE_NAME=Users
```

### 7. Restart Your Server

Stop the server (Ctrl+C) and restart:
```bash
npm run dev
```

Watch the console output for the configuration check.

## Common Issues

### "You are not authorized to perform this operation"
- Your token is missing required scopes
- Token doesn't have access to the base
- Token is invalid or expired

**Solution**: Create a new token with both `data.records:read` and `data.records:write` scopes

### "NOT_FOUND" or 404 errors
- Base ID is incorrect
- Table name is wrong (must be exactly "Users")
- Table was deleted or renamed

**Solution**: Verify Base ID and table name

### "INVALID_REQUEST" errors
- API key format is wrong
- Using old API key format instead of Personal Access Token

**Solution**: Make sure you're using a Personal Access Token (starts with `pat`)

## How to Test

After updating your token:

1. Restart the server
2. Check the console - you should see all ✅ green checkmarks
3. Try signing in with Google again
4. Check the Airtable table - a new record should appear

## Still Having Issues?

Check the server console output:
- Look for ✅ or ❌ next to each configuration item
- Any ❌ means that environment variable is not set
- Check for specific error messages

### Debug Checklist

- [ ] Token starts with `pat`
- [ ] Token has `data.records:read` scope
- [ ] Token has `data.records:write` scope  
- [ ] Token has access to your specific base
- [ ] Base ID starts with `app`
- [ ] Table is named exactly "Users"
- [ ] Server was restarted after .env changes
- [ ] No extra quotes or spaces in .env values

## Example .env File

```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Airtable Configuration
AIRTABLE_API_KEY=patAbCdEfGhIjKlMnOpQrStUvWxYz123456
AIRTABLE_BASE_ID=appAbCdEfGhIjKlMn
AIRTABLE_TABLE_NAME=Users
```

---

**Need more help?** Check the server console for detailed error messages.

