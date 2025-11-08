const express = require('express');
const router = express.Router();
const Tracker = require('../models/Tracker');

// @route   POST /api/tracker
// @desc    Log daily tracker data
router.post('/', async (req, res) => {
  try {
    const { userId, date, steps, water, calories, sleep } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: 'Please provide userId and date' });
    }

    // Check if tracker data already exists for this user and date
    let tracker = await Tracker.findOne({ userId, date });

    if (tracker) {
      // Update existing tracker
      tracker.steps = steps !== undefined ? steps : tracker.steps;
      tracker.water = water !== undefined ? water : tracker.water;
      tracker.calories = calories !== undefined ? calories : tracker.calories;
      tracker.sleep = sleep !== undefined ? sleep : tracker.sleep;
      await tracker.save();
    } else {
      // Create new tracker entry
      tracker = new Tracker({
        userId,
        date,
        steps: steps || 0,
        water: water || 0,
        calories: calories || 0,
        sleep: sleep || 0
      });
      await tracker.save();
    }

    res.status(201).json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tracker
// @desc    Get tracker data (optionally filter by userId and date)
router.get('/', async (req, res) => {
  try {
    const { userId, date } = req.query;
    const filter = {};
    
    if (userId) filter.userId = userId;
    if (date) filter.date = date;

    const trackerData = await Tracker.find(filter).sort({ date: -1 });
    res.json(trackerData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/tracker/:id
// @desc    Get tracker data by id
router.get('/:id', async (req, res) => {
  try {
    const tracker = await Tracker.findById(req.params.id);
    
    if (!tracker) {
      return res.status(404).json({ error: 'Tracker data not found' });
    }

    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/tracker/:id
// @desc    Update tracker data
router.put('/:id', async (req, res) => {
  try {
    const { steps, water, calories, sleep } = req.body;

    const tracker = await Tracker.findByIdAndUpdate(
      req.params.id,
      { steps, water, calories, sleep },
      { new: true, runValidators: true }
    );

    if (!tracker) {
      return res.status(404).json({ error: 'Tracker data not found' });
    }

    res.json(tracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/tracker/:id
// @desc    Delete tracker data
router.delete('/:id', async (req, res) => {
  try {
    const tracker = await Tracker.findByIdAndDelete(req.params.id);

    if (!tracker) {
      return res.status(404).json({ error: 'Tracker data not found' });
    }

    res.json({ success: true, message: 'Tracker data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
