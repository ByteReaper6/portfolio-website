const mongoose = require('mongoose');

// Reuse connection across serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

module.exports = connectDB;
