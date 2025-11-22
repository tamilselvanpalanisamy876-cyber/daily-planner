const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/moods
// @desc    Get all moods for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/moods
// @desc    Log a mood
// @access  Private
router.post('/', protect, async (req, res) => {
    const { mood, note, date } = req.body;

    try {
        const newMood = await Mood.create({
            user: req.user.id,
            mood,
            note,
            date: date || Date.now()
        });
        res.status(201).json(newMood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
