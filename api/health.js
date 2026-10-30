const connectDB = require('../lib/db');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: 'ok',
      db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
  } catch (err) {
    console.error('Health check DB error:', err.message);
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
};
