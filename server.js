// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// show important envs
console.log('NODE ENV:', process.env.NODE_ENV || 'development');
console.log('MONGO_URI present?', !!process.env.MONGO_URI);
console.log('RAZORPAY_KEY_ID present?', !!process.env.RAZORPAY_KEY_ID);

const eventsRoute = require('./routes/events');
const paymentsRoute = require('./routes/payments');
const razorpayWebhook = require('./webhook/razorpayWebhook');

const app = express();
app.use(cors());

// webhook raw body handling
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/razorpay') {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.use('/api/events', eventsRoute);
app.use('/api/payments', paymentsRoute);
app.post('/api/webhook/razorpay', (req, res) => razorpayWebhook(req, res));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college_events';
    await connectDB(mongoUri);
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error('Failed to start server due to DB/connect error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
