const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/tasks
// @desc    Get all tasks for user (sorted by priorityScore)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .sort({ priorityScore: -1, createdAt: -1 }); // Sort by priority score (high to low)
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task (priorityScore auto-calculated)
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, importance, difficulty, deadline, estimatedDuration } = req.body;

    try {
        const task = await Task.create({
            user: req.user.id,
            title,
            importance: importance || 5,
            difficulty: difficulty || 3,
            deadline,
            estimatedDuration: estimatedDuration || 30,
            status: 'Backlog'
        });
        // priorityScore is auto-calculated in pre-save hook
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (priorityScore recalculated)
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            task[key] = req.body[key];
        });

        await task.save(); // This triggers pre-save hook to recalculate priorityScore

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await task.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tasks/notifications
// @desc    Get context-aware notifications (LOGIC BRAIN)
// @access  Private
router.get('/notifications', protect, async (req, res) => {
    try {
        // Get tomorrow's date range
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        // Find tasks due tomorrow
        const tomorrowTasks = await Task.find({
            user: req.user.id,
            deadline: {
                $gte: tomorrow,
                $lt: dayAfterTomorrow
            },
            status: { $ne: 'Done' }
        }).sort({ priorityScore: -1 });

        const notifications = [];

        // CONTEXT-AWARE LOGIC
        tomorrowTasks.forEach(task => {
            const titleLower = task.title.toLowerCase();
            let message = '';

            // Exam/Test/Quiz detection
            if (titleLower.includes('exam') || titleLower.includes('test') || titleLower.includes('quiz')) {
                message = `Tomorrow: ${task.title}. Time to study? 📚`;
            }
            // Meeting detection
            else if (titleLower.includes('meeting')) {
                message = `Reminder: ${task.title} tomorrow. Prepared? 👔`;
            }
            // Generic high priority
            else {
                message = `Focus Mode: ${task.title} is due tomorrow.`;
            }

            notifications.push({
                taskId: task._id,
                message,
                priority: task.priorityScore,
                deadline: task.deadline
            });
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks/auto-schedule
// @desc    Auto-schedule tasks using mathematical heuristics
// @access  Private
router.post('/auto-schedule', protect, async (req, res) => {
    try {
        // Get all Backlog tasks
        const backlogTasks = await Task.find({
            user: req.user.id,
            status: 'Backlog'
        }).sort({ priorityScore: -1 }); // Sort by priority (high to low)

        // Work hours: 9:00 AM to 5:00 PM (480 minutes total)
        const workStartHour = 9;
        const workEndHour = 17;
        let currentTime = workStartHour * 60; // Start at 9:00 AM in minutes

        const scheduledTasks = [];

        for (let task of backlogTasks) {
            const duration = task.estimatedDuration || 30;

            // Check if task fits in remaining work hours
            if (currentTime + duration <= workEndHour * 60) {
                // Convert minutes to HH:MM format
                const hours = Math.floor(currentTime / 60);
                const minutes = currentTime % 60;
                const scheduledTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                task.scheduledTime = scheduledTime;
                task.status = 'Scheduled';
                await task.save();

                scheduledTasks.push({
                    id: task._id,
                    title: task.title,
                    scheduledTime,
                    duration
                });

                currentTime += duration;
            } else {
                // No more time today, break
                break;
            }
        }

        res.json({
            message: `Successfully scheduled ${scheduledTasks.length} tasks`,
            scheduledTasks,
            nextAvailableTime: currentTime < workEndHour * 60
                ? `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`
                : 'No time remaining today'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks/recalculate
// @desc    Recalculate all priority scores
// @access  Private
router.post('/recalculate', protect, async (req, res) => {
    try {
        const tasks = await Task.recalculateScores(req.user.id);
        res.json({
            message: `Recalculated ${tasks.length} tasks`,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
