const connectDB = require('../lib/db');
const Project = require('../models/Project');

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const projects = await Project.find().sort({ order: 1 });
      return res.json(projects);
    } catch (err) {
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const project = new Project(req.body);
      await project.save();
      return res.status(201).json({ success: true, project });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
};
