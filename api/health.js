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
    res.status(500).json({ status: 'error', message: err.message });
  }
};
