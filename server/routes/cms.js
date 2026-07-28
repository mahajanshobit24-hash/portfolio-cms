const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const Project = require('../models/Project');

const router = express.Router();

// Middleware to check admin token (simple version)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token !== 'Bearer shobit-admin-token') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// ==================== CONTENT CMS ROUTES ====================

// Get all content for a section
router.get('/content/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section }).sort({ updatedAt: -1 });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all content sections
router.get('/content', async (req, res) => {
  try {
    const contents = await Content.find().sort({ updatedAt: -1 });
    const result = {};
    contents.forEach(c => { result[c.section] = c.data; });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update content for a section
router.put('/content/:section', authMiddleware, [
  body('data').notEmpty().withMessage('Data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { data } = req.body;
    const content = await Content.findOneAndUpdate(
      { section: req.params.section },
      { 
        data, 
        updatedAt: new Date(),
        updatedBy: req.body.updatedBy || 'admin'
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Content updated successfully', data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset content to default
router.delete('/content/:section', authMiddleware, async (req, res) => {
  try {
    await Content.deleteOne({ section: req.params.section });
    res.json({ success: true, message: 'Content reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== PROJECT CMS ROUTES ====================

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const { status, category, featured } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects, count: projects.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create project
router.post('/projects', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Customer Support', 'Graphic Design', 'Website', 'Digital Marketing', 'Other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update project
router.put('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete project
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle project featured status
router.patch('/projects/:id/featured', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.featured = !project.featured;
    await project.save();
    res.json({ success: true, message: 'Project featured status updated', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update project order
router.patch('/projects/:id/order', authMiddleware, async (req, res) => {
  try {
    const { order } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Order updated', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;