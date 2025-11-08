const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['Cardio', 'Strength', 'Yoga', 'Flexibility', 'Sports', 'Other']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);
