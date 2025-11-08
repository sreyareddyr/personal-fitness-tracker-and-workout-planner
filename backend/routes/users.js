const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users/register
// @desc    Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, age, height, weight } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (In production, hash the password using bcrypt!)
    const user = new User({
      username,
      email,
      password, // TODO: Hash this in production!
      age,
      height,
      weight
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { username, age, height, weight } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, age, height, weight },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
