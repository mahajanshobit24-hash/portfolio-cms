const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ipAddress: { type: String },
  userAgent: { type: String },
  page: { type: String },
  referrer: { type: String },
  country: { type: String },
  city: { type: String }
}, {
  timestamps: true
});

visitorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);