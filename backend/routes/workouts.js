const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// @route   POST /api/workouts
// @desc    Create new workout
router.post('/', async (req, res) => {
  try {
    const { userId, title, type, duration, description, date } = req.body;

    if (!userId || !title || !type || !duration) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const workout = new Workout({
      userId,
      title,
      type,
      duration,
      description,
      date: date || new Date()
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/workouts
// @desc    Get all workouts (optionally filter by userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    
    const workouts = await Workout.find(filter).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get workout by id
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
router.put('/:id', async (req, res) => {
  try {
    const { title, type, duration, description, completed } = req.body;

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { title, type, duration, description, completed },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
