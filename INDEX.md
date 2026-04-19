# College Event Organizer - START HERE

Welcome! This is your complete full-stack college event management platform. Here's how to get started:

## 📋 Quick Navigation

### 🚀 Getting Started (5 minutes)
1. **First Time?** → Read [QUICKSTART.md](./QUICKSTART.md)
   - Installation steps
   - Starting the servers
   - First test

2. **Want Details?** → Read [README.md](./README.md)
   - Full feature list
   - Project structure
   - API endpoints
   - Database schema

### 🔧 Development & Extension
- **How does it work?** → [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
  - Architecture overview
  - Workflow explanations
  - How to extend features
  - Security considerations

### 📁 File Structure

**Backend** (`server/`)
```
models/        → Database schemas (User, Event, Participant, Payment)
controllers/   → Business logic (auth, events, participants, payments)
routes/        → API endpoints
middleware/    → Auth verification, error handling
utils/         → QR code generation, JWT handling
server.js      → Main Express app
package.json   → Dependencies
.env           → Configuration (edit with your settings)
```

**Frontend** (`client/`)
```
src/
├── pages/      → Full-page components (Login, Home, Dashboard, etc)
├── components/ → Reusable components (Navigation, ProtectedRoute)
├── styles/     → CSS files (one per page/component)
├── utils/      → Helper functions (API calls)
├── App.js      → Main routing
└── index.js    → React entry point
public/        → Static files (index.html, manifest.json)
package.json   → Dependencies
```

**Root** (`/`)
```
server/        → Backend application
client/        → Frontend application
package.json   → Root dependencies script
.gitignore     → Git configuration
.env           → Root environment config
README.md      → Full documentation
```

## 🎯 Common Tasks

### "I want to start the app"
→ [QUICKSTART.md](./QUICKSTART.md)

### "I don't understand the API"
→ See "API Endpoints" in [README.md](./README.md)

### "I want to add a new feature"
→ See "Extending the Application" in [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

### "How do I deploy this?"
→ See "Deployment" in [README.md](./README.md)

### "Something isn't working"
→ See "Troubleshooting" in [README.md](./README.md)

## 👥 User Roles Explained

### Participant
- Browse events
- Register for events (generates QR code)
- View registration history
- Pay fees
- Check in at events

### Organizer
- Create and manage events
- View registered participants
- Collect payments
- Track event revenue
- Verify attendees

### Admin
- Everything an Organizer can do, plus:
- View platform-wide analytics
- Monitor all events and payments
- Generate reports

## 💡 How It Works

### Event Lifecycle
```
1. Organizer creates event
2. Participant discovers event
3. Participant registers → QR code generated
4. Participant sees pending payment status
5. Admin collects payment via QR code
6. Payment status updates to completed
7. Admin can verify participant
8. Participant checks in at event
```

### Payment Flow
```
1. Participant registers
   → Payment record created (status: pending)
   → Payment QR code generated

2. Admin goes to Payment Collection
   → Scans or searches for payment ID
   → Clicks "Collect Payment"
   → Payment marked complete
   → Event revenue updated
```

## 🔐 Security

- Passwords hashed with bcryptjs
- Tokens expire after 7 days
- JWT-based authentication
- Role-based access control
- MongoDB injection prevention

## 📊 Key Features

- ✅ User registration with roles
- ✅ Event creation and management
- ✅ QR code generation for registrations
- ✅ Payment tracking and collection
- ✅ Admin dashboard with analytics
- ✅ Responsive mobile-friendly design
- ✅ Real-time data updates
- ✅ Error handling and validation

## 🛠️ Tech Stack

**Backend**: Node.js + Express.js + MongoDB + JWT  
**Frontend**: React 18 + React Router + Axios + CSS3  
**DevOps**: npm, nodemon, git

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute setup guide |
| [README.md](./README.md) | Complete documentation |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | How it works & extending |
| INDEX.md | This file - navigation guide |

## ⚡ First Steps

1. **Install**: `npm run install-all`
2. **Configure**: Edit `server/.env` with your MongoDB URI
3. **Start Backend**: `cd server && npm run dev`
4. **Start Frontend**: `cd client && npm start`
5. **Test**: Register, create event, register for event
6. **Explore**: Try all the features!

## 📞 Need Help?

- Check the relevant documentation file above
- Look for error messages in browser console (F12)
- Check terminal for backend errors
- Review "Troubleshooting" in README.md

## 🎉 What's Next?

1. Get it running with [QUICKSTART.md](./QUICKSTART.md)
2. Understand the architecture from [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
3. Customize and extend the application
4. Deploy to production (see [README.md](./README.md))

---

**You're all set!** Start with [QUICKSTART.md](./QUICKSTART.md) and you'll be running the app in 5 minutes. 🚀
