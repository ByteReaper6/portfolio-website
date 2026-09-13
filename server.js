require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const Message = require('./models/Message');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(express.static(path.join(__dirname))); // serve static files

// Rate limiting for contact form submissions
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 messages per window per IP
  message: { error: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve index.html for the root route explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1); // stop the server if DB fails to connect
  });

// ─── API Routes: Messages (Contact Form) ─────────────────────────────────────

// POST /api/messages — save a new contact form submission
app.post('/api/messages', messageLimiter, async (req, res) => {
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

    res.status(201).json({ success: true, message: 'Message received. Thanks!' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    console.error('POST /api/messages error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/messages — get all messages (admin only, requires auth token)
app.get('/api/messages', apiLimiter, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    return res.status(503).json({ error: 'Admin access not configured.' });
  }

  if (!token || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized. Valid admin token required.' });
  }

  Message.find()
    .sort({ createdAt: -1 })
    .then((messages) => res.json(messages))
    .catch(() => res.status(500).json({ error: 'Server error.' }));
});

// ─── API Routes: Projects ─────────────────────────────────────────────────────

// GET /api/projects — get all projects sorted by order field
app.get('/api/projects', apiLimiter, async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/projects — add a new project (admin only)
app.post('/api/projects', apiLimiter, async (req, res) => {
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
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', apiLimiter, (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── Start Server (local dev only) ────────────────────────────────────────────
// On Vercel, the app is exported as a serverless function — no listen() needed.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀  Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
