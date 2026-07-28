const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Customer Support', 'Graphic Design', 'Website', 'Digital Marketing', 'Other']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

projectSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);