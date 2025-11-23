const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    importance: {
        type: Number,
        min: 1,
        max: 10,
        default: 5,
        required: true
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    deadline: {
        type: Date
    },
    estimatedDuration: {
        type: Number, // in minutes
        default: 30
    },
    status: {
        type: String,
        enum: ['Backlog', 'Scheduled', 'Done'],
        default: 'Backlog'
    },
    priorityScore: {
        type: Number,
        default: 0
    },
    scheduledTime: {
        type: String // Format: "HH:MM" for auto-scheduling
    }
}, {
    timestamps: true
});

// LOGIC BRAIN: Calculate Priority Score before saving
taskSchema.pre('save', function (next) {
    this.priorityScore = calculatePriorityScore(this);
    next();
});

// Mathematical Heuristic Function
function calculatePriorityScore(task) {
    let score = 0;

    // Base: Importance * 2
    score += (task.importance || 5) * 2;

    // Deadline Proximity Score
    if (task.deadline) {
        const now = new Date();
        const deadline = new Date(task.deadline);
        const hoursUntilDeadline = (deadline - now) / (1000 * 60 * 60);

        if (hoursUntilDeadline < 0) {
            // Overdue: Maximum urgency
            score += 50;
        } else if (hoursUntilDeadline < 24) {
            // Due within 24 hours
            score += 20;
        } else if (hoursUntilDeadline < 48) {
            // Due within 48 hours
            score += 10;
        } else if (hoursUntilDeadline < 168) {
            // Due within a week
            score += 5;
        }
    }

    // Small Task Bonus (Quick wins)
    if (task.estimatedDuration && task.estimatedDuration < 15) {
        score += 5;
    }

    // Difficulty penalty (harder tasks get slight boost to prevent procrastination)
    if (task.difficulty && task.difficulty >= 4) {
        score += 3;
    }

    return Math.round(score);
}

// Static method to recalculate all scores (for batch updates)
taskSchema.statics.recalculateScores = async function (userId) {
    const tasks = await this.find({ user: userId, status: { $ne: 'Done' } });

    for (let task of tasks) {
        task.priorityScore = calculatePriorityScore(task);
        await task.save();
    }

    return tasks;
};

module.exports = mongoose.model('Task', taskSchema);
