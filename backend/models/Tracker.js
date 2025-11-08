const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  steps: {
    type: Number,
    default: 0,
    min: 0,
    max: 100000
  },
  water: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  calories: {
    type: Number,
    default: 0,
    min: 0,
    max: 10000
  },
  sleep: {
    type: Number,
    default: 0,
    min: 0,
    max: 24
  }
}, {
  timestamps: true
});

// Ensure one tracker entry per user per day
TrackerSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Tracker', TrackerSchema);
