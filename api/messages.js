const connectDB = require('../lib/db');
const Message = require('../models/Message');

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
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
