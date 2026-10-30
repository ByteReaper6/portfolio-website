const mongoose = require('mongoose');

// Reuse one connection across serverless invocations.
// Cache the promise (not a boolean) so concurrent requests share it,
// and clear it on failure so the next request can retry.
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // fail fast instead of hanging until Vercel times out
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  await connectionPromise;
  return mongoose.connection;
}

module.exports = connectDB;
