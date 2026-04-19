# Quick Start Guide

Get your College Event Organizer running in 5 minutes!

## Prerequisites
- Node.js installed
- MongoDB running (local or cloud)
- Code editor (VS Code recommended)

## Step 1: Install Dependencies (2 minutes)

```bash
# From project root
npm run install-all
```

This installs dependencies for both server and client.

## Step 2: Configure MongoDB (1 minute)

Edit `server/.env`:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/college-event-organizer
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/college-event-organizer
```

## Step 3: Start the Application (1 minute)

**Open Two Terminals:**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# Opens at http://localhost:3000
```

## Step 4: Test the Application (1 minute)

1. Visit `http://localhost:3000`
2. Click **Register**
3. Create account with role **Participant**
4. Click **Events** to browse
5. Register for an event
6. View in **My Participations**

## Test Credentials

**Create your own by registering, or use:**
- Email: test@example.com
- Password: Test@123

## Next Steps

- Create an **Organizer** account to create events
- Create an **Admin** account to view dashboard
- Read [README.md](./README.md) for full documentation

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Ensure MongoDB is running and connection string is correct |
| "Port 5000/3000 already in use" | Change PORT in `.env` or kill process using the port |
| "Module not found" | Run `npm run install-all` again |

## API Testing

Once the server is running, test endpoints with curl or Postman:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass@123","phone":"9876543210","role":"participant"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Pass@123"}'

# Get Events
curl http://localhost:5000/api/events
```

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review error messages in browser console (F12)
- Check backend logs in terminal

---

Happy organizing! 🎉
