const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['personalInfo', 'skills', 'experiences', 'education', 'services', 'projects', 'stats', 'strengths', 'languages']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

contentSchema.index({ section: 1 });

module.exports = mongoose.model('Content', contentSchema);