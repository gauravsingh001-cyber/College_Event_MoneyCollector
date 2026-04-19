# College Event Organizer - Full Stack Application

A complete full-stack web application for managing college events with integrated payment collection, participant registration, and admin dashboards.

## Features

### For Participants
- Browse and discover college events
- Register for events with automatic QR code generation
- View personal participation history
- Track payment status
- Check-in at events

### For Organizers
- Create and manage events
- View registered participants
- Track event revenue
- Monitor payment collection
- Verify attendees

### For Admins
- Platform-wide analytics dashboard
- Monitor all events and revenue
- Collect payments via QR code scanning
- Event-wise revenue tracking
- Payment status monitoring

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **QR Codes**: qrcode library

### Frontend
- **Library**: React 18+
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Forms**: Native HTML5 + fetch API
- **Styling**: CSS3 with responsive design

## Project Structure

```
CollegeEventOrganizer/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Participant.js
│   │   └── Payment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── participantController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── participantRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── qrCode.js
│   │   └── jwt.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── EventDetail.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── OrganizerDashboard.js
│   │   │   ├── PaymentCollection.js
│   │   │   ├── MyParticipations.js
│   │   │   └── ProfilePage.js
│   │   ├── styles/
│   │   │   └── [CSS files for each component]
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   └── package.json
├── package.json
└── .env

```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn
- Git

## Installation & Setup

### 1. Clone/Extract the Project
```bash
cd CollegeEventOrganizer
```

### 2. Install Root Dependencies
```bash
npm run install-all
```

This will install dependencies for both server and client.

### 3. Configure MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Update `server/.env`:
  ```
  MONGODB_URI=mongodb://localhost:27017/college-event-organizer
  ```
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at mongodb.com
- Create a cluster and get connection string
- Update `server/.env`:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/college-event-organizer
  ```

### 4. Configure Environment Variables

Edit `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/college-event-organizer
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a strong random string in production.

### 5. Start the Application

**Terminal 1 - Start Backend Server**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Start Frontend Server**
```bash
cd client
npm start
# Frontend will run on http://localhost:3000
```

The application should now be accessible at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event (organizer/admin)
- `DELETE /api/events/:id` - Delete event (organizer/admin)
- `GET /api/events/organizer/my-events` - Get organizer's events

### Participants
- `POST /api/participants/register` - Register for event (protected)
- `GET /api/participants` - Get all participants
- `GET /api/participants/:id` - Get participant details
- `POST /api/participants/check-in` - Check-in participant (admin/organizer)
- `POST /api/participants/verify` - Verify participant (admin/organizer)
- `GET /api/participants/my-participations` - Get user's registrations

### Payments
- `POST /api/payments/create` - Create payment record (protected)
- `POST /api/payments/collect` - Collect payment (admin/organizer)
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/event/:eventId/revenue` - Get event revenue
- `GET /api/payments/admin/dashboard` - Admin dashboard stats (admin only)

## User Roles & Permissions

### Participant
- Browse events
- Register for events
- View registration status
- Check-in at events
- View participation history

### Organizer
- Create and manage events
- View registered participants
- Check-in participants
- Verify attendees
- View event revenue

### Admin
- All organizer permissions
- Access admin dashboard
- View platform-wide analytics
- Collect payments
- Monitor all events and payments

## Database Schema

### User Collection
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phone`: String
- `role`: Enum [participant, organizer, admin]
- `department`: String
- `registrationNumber`: String
- `profilePhoto`: String
- `isVerified`: Boolean

### Event Collection
- `title`: String
- `description`: String
- `organizer`: ObjectId (ref: User)
- `category`: Enum [technical, cultural, sports, academic, other]
- `venue`: String
- `startDate`: Date
- `endDate`: Date
- `eventImage`: String
- `registrationFee`: Number
- `maxParticipants`: Number
- `currentParticipants`: Number
- `status`: Enum [upcoming, ongoing, completed, cancelled]
- `totalRevenue`: Number

### Participant Collection
- `user`: ObjectId (ref: User)
- `event`: ObjectId (ref: Event)
- `registrationDate`: Date
- `paymentStatus`: Enum [pending, completed, failed]
- `paymentId`: ObjectId (ref: Payment)
- `checkInStatus`: Boolean
- `checkInTime`: Date
- `qrCode`: String (Base64)
- `isVerified`: Boolean
- `verifiedAt`: Date
- `verifiedBy`: ObjectId (ref: User)

### Payment Collection
- `participant`: ObjectId (ref: Participant)
- `event`: ObjectId (ref: Event)
- `user`: ObjectId (ref: User)
- `amount`: Number
- `paymentMethod`: Enum [qr-code, card, upi, bank-transfer]
- `transactionId`: String (unique)
- `paymentGateway`: Enum [razorpay, paytm, stripe, local]
- `status`: Enum [pending, processing, completed, failed, refunded]
- `paymentDate`: Date
- `qrCodeData`: String (Base64)
- `collectedBy`: ObjectId (ref: User)
- `collectionTime`: Date

## Authentication Flow

1. User registers/logs in
2. Backend verifies credentials and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include `Authorization: Bearer <token>` header
5. Backend verifies token and processes request
6. If token expires (7 days), user must login again

## Deployment

### Backend (Node.js on Heroku)

1. Create Heroku account and app
2. Connect to GitHub repository
3. Set environment variables in Heroku Dashboard
4. Deploy: `git push heroku main`

### Frontend (React on Vercel/Netlify)

1. Build: `npm run build`
2. Deploy build folder to Vercel/Netlify
3. Configure API endpoint in `.env.production`

## Development Notes

- Backend runs on port 5000 by default
- Frontend runs on port 3000 by default
- MongoDB connection is required for the app to work
- QR codes are generated as Data URLs (Base64 encoded PNG images)
- All passwords are hashed with bcryptjs before storage
- JWT tokens expire after 7 days (configurable)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check cloud connection string
- Verify `MONGODB_URI` in `server/.env`

### Port Already in Use
- Change PORT in `server/.env` or `client/.env`
- Or kill process using the port

### CORS Error
- Ensure `CLIENT_URL` in `server/.env` matches frontend URL
- Check `Authorization` header is included in requests

### QR Code Not Displaying
- Check if `qrcode` package is installed in server
- Verify QR data is valid JSON

## Future Enhancements

- [ ] Email notifications for event registrations
- [ ] SMS payment reminders
- [ ] Real payment gateway integration (Razorpay, Stripe)
- [ ] Advanced analytics and reports
- [ ] Event calendar view
- [ ] Participant feedback and ratings
- [ ] Automatic refund processing
- [ ] Multi-language support

## License

MIT License - Feel free to use this project for educational purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Happy Event Organizing! 🎉**
