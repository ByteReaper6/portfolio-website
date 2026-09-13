const connectDB = require('../lib/db');
const Message = require('../models/Message');

const submissions = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 10;

  if (!submissions.has(ip)) {
    submissions.set(ip, []);
  }

  const timestamps = submissions.get(ip).filter((t) => now - t < windowMs);
  submissions.set(ip, timestamps);

  if (timestamps.length >= max) return true;
  timestamps.push(now);
  return false;
}

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many messages sent. Please try again later.' });
    }

    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (name.length > 100 || message.length > 2000) {
        return res.status(400).json({ error: 'Input exceeds allowed length.' });
      }

      const newMessage = new Message({ name, email, message });
      await newMessage.save();
      return res.status(201).json({ success: true, message: 'Message received. Thanks!' });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken) {
      return res.status(503).json({ error: 'Admin access not configured.' });
    }

    if (!token || token !== adminToken) {
      return res.status(401).json({ error: 'Unauthorized. Valid admin token required.' });
    }

    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
};
