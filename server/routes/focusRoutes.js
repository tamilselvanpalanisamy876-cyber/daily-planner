const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/focus/log
// @desc    Log a completed focus session
// @access  Private
router.post('/log', protect, async (req, res) => {
    const { minutes } = req.body;

    if (!minutes || minutes <= 0) {
        return res.status(400).json({ message: 'Invalid duration' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.totalFocusMinutes = (user.totalFocusMinutes || 0) + minutes;
            user.xp = (user.xp || 0) + (minutes * 2); // 2 XP per minute of focus

            await user.save();

            res.json({
                message: 'Focus session logged',
                totalFocusMinutes: user.totalFocusMinutes,
                xp: user.xp
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
