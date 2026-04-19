# Implementation Guide

This guide explains how the College Event Organizer application works and how to extend it.

## Architecture Overview

```
User Interface (React)
         ↓
     API Layer (Axios)
         ↓
   Express Server
         ↓
  Controllers (Business Logic)
         ↓
   Mongoose Models
         ↓
    MongoDB Database
```

## Authentication Flow

1. **Registration**
   ```
   User enters credentials → Register endpoint 
   → Hash password with bcryptjs 
   → Create User document 
   → Generate JWT token 
   → Return token to client
   ```

2. **Login**
   ```
   User enters email/password → Login endpoint 
   → Find user by email 
   → Compare password with bcryptjs 
   → Generate JWT token 
   → Return token to client
   ```

3. **Protected Requests**
   ```
   Client sends request with Authorization header 
   → Auth middleware extracts token 
   → Verifies JWT signature 
   → Attaches user data to request 
   → Routes process with user context
   ```

## Core Workflows

### Event Creation Workflow

1. **Organizer creates event**
   - POST `/api/events` with event details
   - Controller validates input
   - Creates Event document with organizer = req.user.id
   - Returns created event

2. **Event retrieval**
   - GET `/api/events` returns all events
   - GET `/api/events/:id` returns specific event with populated organizer details
   - Filtering available by status and category

### Event Registration Workflow

1. **Participant registers**
   - POST `/api/participants/register` with eventId
   - Check if user already registered
   - Create Participant document
   - Generate QR code from JSON {participantId, eventId, userId}
   - Store QR as Base64 string
   - Increment event.currentParticipants
   - Return Participant with QR code

2. **Payment creation**
   - POST `/api/payments/create` with participantId and eventId
   - Create Payment document with status: 'pending'
   - Generate payment QR code with {paymentId, participantId, eventId, amount}
   - Return Payment with QR code

### Payment Collection Workflow

1. **Admin scans QR code**
   - Extract paymentId from QR data
   - GET `/api/payments/:paymentId`
   - Display payment details and QR

2. **Admin collects payment**
   - POST `/api/payments/collect` with paymentId
   - Update Payment: status='completed', paymentDate=now, collectedBy=req.user.id
   - Update Participant: paymentStatus='completed'
   - Update Event: totalRevenue += amount
   - Return confirmation

## Key Concepts

### QR Code Generation

QR codes are generated using the `qrcode` library and stored as Data URLs:

```javascript
const qrData = JSON.stringify({
  participantId: participant._id,
  eventId: eventId,
  userId: req.user.id
});

const qrCode = await QRCode.toDataURL(qrData);
// Returns: 'data:image/png;base64,...'
```

The Data URL can be directly used as an image src.

### JWT Token Structure

Tokens are created with:
```javascript
{
  id: userId,
  role: userRole,
  iat: issuedAt,
  exp: expiresAt (7 days from now)
}
```

Tokens are verified on every protected request and attached to `req.user`.

### Database Relationships

```
User (1) ──── (Many) Event
           (organizer field)

User (1) ──── (Many) Participant
           (user field)

Event (1) ──── (Many) Participant
           (event field)

Participant (1) ──── (1) Payment
           (participant field)

Event (1) ──── (Many) Payment
           (event field)

User (1) ──── (Many) Payment
           (user field)
```

## Component Structure

### React Components

```
App (Main Router)
├── Navigation (Header with links)
├── ProtectedRoute (Wrapper for auth-required routes)
├── Login (Public)
├── Register (Public)
├── Home (Browse events)
├── EventDetail (Event information + register)
├── MyParticipations (User's registrations)
├── ProfilePage (Update profile)
├── AdminDashboard (Restricted to admin)
├── OrganizerDashboard (Restricted to organizer)
└── PaymentCollection (Restricted to admin/organizer)
```

### Component Communication

```
App (state: user, setUser)
  ├─ stores user from localStorage
  ├─ fetches profile on mount
  ├─ passes user to all routes
  ├─ passes setUser to ProfilePage
  └─ handles login/logout
```

## API Response Format

**Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... },
  "data": { ... }
}
```

**Error Response:**
```json
{
  "message": "Error description"
}
```

## Database Indexes

For optimal performance:

```javascript
// User model
Email index: { unique: true, lowercase: true }

// Participant model  
Compound index: { user: 1, event: 1 } (unique)
// Ensures one registration per user per event

// Payment model
TransactionId index: { unique: true, sparse: true }
// For payment gateway transaction IDs
```

## Environment Variables

**Backend** (`server/.env`):
```
MONGODB_URI          # MongoDB connection string
JWT_SECRET          # Secret key for signing JWTs
JWT_EXPIRE          # Token expiration time (default: 7d)
PORT                # Server port (default: 5000)
CLIENT_URL          # Frontend URL for CORS
NODE_ENV            # development/production
```

**Frontend** (automatic via `.env`):
```
REACT_APP_API_URL   # Backend API endpoint
```

## Error Handling

### Backend Error Handling
```javascript
// Global error middleware catches:
- CastError (invalid MongoDB ID)
- JsonWebTokenError (invalid token)
- TokenExpiredError (expired token)
- Duplicate key error (unique constraint violation)
- Validation errors
- Custom error messages
```

### Frontend Error Handling
```javascript
// Try-catch blocks wrap all API calls
// Errors displayed to user via error messages
// Loading states prevent double submissions
```

## Security Considerations

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Never returned in API responses

2. **Token Security**
   - Stored in localStorage (accessible to XSS)
   - Consider using httpOnly cookies in production
   - Expires after 7 days
   - Verified on every protected request

3. **Data Validation**
   - All inputs validated before processing
   - MongoDB injection prevention via mongoose
   - CORS enabled only for configured origins

4. **Authorization**
   - Role-based access control on routes
   - User can only modify own profile/registrations
   - Organizer can only modify own events

## Extending the Application

### Adding a New Feature

1. **Define database schema** (if needed)
   ```javascript
   // Create model in server/models/
   const reviewSchema = new Schema({ ... });
   module.exports = mongoose.model('Review', reviewSchema);
   ```

2. **Create controller** 
   ```javascript
   // Create in server/controllers/
   exports.createReview = async (req, res) => { ... }
   ```

3. **Create routes**
   ```javascript
   // Create in server/routes/
   router.post('/reviews', protect, controller.createReview);
   ```

4. **Create React component**
   ```javascript
   // Create in client/src/pages/ or client/src/components/
   const ReviewPage = () => { ... }
   ```

5. **Add styling**
   ```css
   /* Create in client/src/styles/ */
   ```

6. **Update routing**
   ```javascript
   // Add to App.js routes
   <Route path="/reviews" element={<ReviewPage />} />
   ```

## Testing Workflows

### Test Event Creation
1. Register as organizer
2. Go to Organizer Dashboard
3. Create event
4. Verify event appears in My Events
5. Logout and view as participant
6. Verify event visible in Events list

### Test Registration
1. Register as participant
2. View event details
3. Click Register Now
4. Verify in My Participations
5. Check QR code generated

### Test Payment Collection
1. Register as participant and complete registration
2. Get payment ID from database
3. Login as admin
4. Go to Payment Collection
5. Search by payment ID
6. Click Collect Payment
7. Verify status updated in database

## Performance Optimization

1. **Database Queries**
   - Use `.populate()` to get related data in single query
   - Use `.select()` to retrieve only needed fields
   - Add indexes on frequently queried fields

2. **Frontend**
   - Lazy load routes with React.lazy()
   - Use React.memo() for components
   - Debounce search inputs
   - Optimize images

3. **API**
   - Implement pagination for large datasets
   - Cache static data
   - Compress responses with gzip

## Deployment Checklist

- [ ] Update JWT_SECRET to strong random value
- [ ] Set NODE_ENV to production
- [ ] Configure production MONGODB_URI
- [ ] Set proper CLIENT_URL for CORS
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure backups
- [ ] Test all user flows

---

For more details, see [README.md](./README.md) and [QUICKSTART.md](./QUICKSTART.md)
