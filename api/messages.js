const connectDB = require('../lib/db');
const Message = require('../models/Message');
const { sendTelegramNotification } = require('../lib/telegram');

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
  // ── CORS headers (required for Vercel serverless) ──────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (forwarded ? String(forwarded).split(',')[0].trim() : req.socket?.remoteAddress) || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many messages sent. Please try again later.' });
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { name, email, message } = body;
      if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'All fields are required.' });
      }
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

      // Validate against the schema before trying to store or forward anything
      const newMessage = new Message({ name, email, message });
      await newMessage.validate();

      // Save to MongoDB, but don't let a database outage lose the message:
      // if the DB is down, the Telegram notification still delivers it.
      let saved = false;
      try {
        await connectDB();
        await newMessage.save();
        saved = true;
      } catch (dbErr) {
        console.error('Could not save message to MongoDB:', dbErr.message);
      }

      // Await Telegram notification (Vercel kills the function otherwise)
      const notified = await sendTelegramNotification(name, email, message);

      if (!saved && !notified) {
        return res.status(503).json({ error: 'Message could not be delivered right now. Please email me instead.' });
      }

      return res.status(201).json({ success: true, message: 'Message received. Thanks!' });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: errors.join(', ') });
      }
      if (err instanceof SyntaxError) {
        return res.status(400).json({ error: 'Invalid request body.' });
      }
      console.error('POST /api/messages error:', err);
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
      await connectDB();
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json(messages);
    } catch (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
};

