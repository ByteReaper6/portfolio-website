const https = require('https');
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

// ─── Telegram Notification ────────────────────────────────────────────────────
function sendTelegramNotification(name, email, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Promise.resolve();

  const text =
    `📬 *New Portfolio Message*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `💬 *Message:*\n${message}`;

  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });

  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`⚠️  Telegram API returned status ${res.statusCode}`);
      }
      res.resume(); // drain the response
      resolve();
    });

    req.on('error', (err) => {
      console.error('⚠️  Telegram notification failed:', err.message);
      resolve(); // never reject — don't break the user flow
    });

    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  // ── CORS headers (required for Vercel serverless) ──────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

      // Await Telegram notification (Vercel kills the function otherwise)
      await sendTelegramNotification(name, email, message);

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

