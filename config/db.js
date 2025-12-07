// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    console.log('Connecting to MongoDB with URI:', !!uri ? uri : '<<NO URI provided>>');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // do not exit immediately — return the error so server.js can decide
    throw err;
  }
};

module.exports = connectDB;
