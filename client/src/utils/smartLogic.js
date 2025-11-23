// Smart logic engine - AI-like behavior without actual AI

// 1. Task Priority Intelligence
export const calculateSmartPriority = (task) => {
    let score = 0;

    // Due date urgency
    if (task.dueDate) {
        const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue < 0) score += 100; // Overdue
        else if (daysUntilDue === 0) score += 80; // Due today
        else if (daysUntilDue === 1) score += 60; // Due tomorrow
        else if (daysUntilDue <= 3) score += 40; // Due this week
        else if (daysUntilDue <= 7) score += 20; // Due next week
    }

    // User-set priority
    if (task.priority === 'high') score += 50;
    else if (task.priority === 'medium') score += 25;

    // Category importance (work > personal)
    if (task.category === 'work') score += 15;
    else if (task.category === 'health') score += 10;

    // Task age (older tasks get priority)
    const daysSinceCreated = Math.ceil((new Date() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated > 7) score += 15;
    else if (daysSinceCreated > 3) score += 10;

    return score;
};

// 2. Smart Time Slot Suggestion
export const suggestBestTimeSlot = (task, existingTasks = []) => {
    const hour = new Date().getHours();

    // Work tasks: 9 AM - 5 PM
    if (task.category === 'work') {
        return { start: '09:00', end: '17:00', reason: 'Work hours' };
    }

    // Health/Exercise: Morning or evening
    if (task.category === 'health') {
        if (hour < 10) return { start: '07:00', end: '08:00', reason: 'Morning energy' };
        return { start: '18:00', end: '19:00', reason: 'Evening workout' };
    }

    // Learning: When mind is fresh
    if (task.category === 'learning') {
        return { start: '10:00', end: '12:00', reason: 'Peak focus time' };
    }

    // Personal: Flexible
    return { start: '14:00', end: '16:00', reason: 'Afternoon slot' };
};

// 3. Smart Reminder Timing
export const calculateReminderTimes = (task) => {
    const reminders = [];

    if (!task.dueDate) return reminders;

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);

    // High priority: More reminders
    if (task.priority === 'high') {
        if (hoursUntilDue > 24) {
            reminders.push({
                time: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000),
                message: `⚠️ High priority task due tomorrow: ${task.title}`
            });
        }
        if (hoursUntilDue > 2) {
            reminders.push({
                time: new Date(dueDate.getTime() - 2 * 60 * 60 * 1000),
                message: `🔴 Urgent: ${task.title} due in 2 hours!`
            });
        }
    }

    // Medium priority: Standard reminders
    if (task.priority === 'medium') {
        if (hoursUntilDue > 24) {
            reminders.push({
                time: new Date(dueDate.getTime() - 24 * 60 * 60 * 1000),
                message: `📅 Reminder: ${task.title} due tomorrow`
            });
        }
    }

    // All tasks: 1 hour before
    if (hoursUntilDue > 1 && hoursUntilDue <= 24) {
        reminders.push({
            time: new Date(dueDate.getTime() - 60 * 60 * 1000),
            message: `⏰ ${task.title} due in 1 hour`
        });
    }

    return reminders;
};

// 4. Pattern Learning (from localStorage)
export const learnUserPatterns = () => {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');

    // Most productive time
    const hourCounts = {};
    completedTasks.forEach(task => {
        if (task.completedAt) {
            const hour = new Date(task.completedAt).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
    });

    const mostProductiveHour = Object.keys(hourCounts).reduce((a, b) =>
        hourCounts[a] > hourCounts[b] ? a : b, 9
    );

    // Favorite categories
    const categoryCounts = {};
    completedTasks.forEach(task => {
        if (task.category) {
            categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
        }
    });

    return {
        mostProductiveHour: parseInt(mostProductiveHour),
        favoriteCategories: Object.keys(categoryCounts).sort((a, b) =>
            categoryCounts[b] - categoryCounts[a]
        ),
        averageCompletionTime: completedTasks.length > 0
            ? completedTasks.reduce((sum, t) => sum + (t.timeSpent || 30), 0) / completedTasks.length
            : 30,
        completionRate: completedTasks.length / (completedTasks.length + 10) * 100 // Rough estimate
    };
};

// 5. Smart Task Breakdown
export const suggestSubtasks = (task) => {
    const suggestions = [];

    // Work tasks
    if (task.category === 'work') {
        suggestions.push('Research and gather information');
        suggestions.push('Create outline or plan');
        suggestions.push('Execute main work');
        suggestions.push('Review and refine');
        suggestions.push('Submit or deliver');
    }

    // Learning tasks
    if (task.category === 'learning') {
        suggestions.push('Watch tutorial or read material');
        suggestions.push('Take notes');
        suggestions.push('Practice exercises');
        suggestions.push('Review and summarize');
    }

    // Health tasks
    if (task.category === 'health') {
        suggestions.push('Warm up (5 min)');
        suggestions.push('Main activity (20-30 min)');
        suggestions.push('Cool down (5 min)');
        suggestions.push('Track progress');
    }

    return suggestions;
};

// 6. Smart Daily Plan Generator
export const generateDailyPlan = (tasks) => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(t =>
        t.dueDate && new Date(t.dueDate).toDateString() === today
    );

    // Sort by smart priority
    const sortedTasks = todayTasks
        .map(t => ({ ...t, smartScore: calculateSmartPriority(t) }))
        .sort((a, b) => b.smartScore - a.smartScore);

    const plan = {
        morning: [],
        afternoon: [],
        evening: []
    };

    sortedTasks.forEach(task => {
        const timeSlot = suggestBestTimeSlot(task);
        const hour = parseInt(timeSlot.start.split(':')[0]);

        if (hour < 12) plan.morning.push(task);
        else if (hour < 17) plan.afternoon.push(task);
        else plan.evening.push(task);
    });

    return plan;
};

// 7. Smart Suggestions Generator
export const generateSmartSuggestions = (tasks, userPatterns) => {
    const suggestions = [];
    const now = new Date();
    const hour = now.getHours();

    // Morning suggestions (6-12)
    if (hour >= 6 && hour < 12) {
        const morningTasks = tasks.filter(t =>
            t.category === 'health' || t.category === 'learning'
        );
        if (morningTasks.length > 0) {
            suggestions.push({
                type: 'time-based',
                icon: '☀️',
                message: `Good morning! Start with ${morningTasks[0].title}`,
                task: morningTasks[0]
            });
        }
    }

    // Afternoon suggestions (12-17)
    if (hour >= 12 && hour < 17) {
        const workTasks = tasks.filter(t => t.category === 'work' && t.priority === 'high');
        if (workTasks.length > 0) {
            suggestions.push({
                type: 'priority',
                icon: '🎯',
                message: `Focus time! Tackle: ${workTasks[0].title}`,
                task: workTasks[0]
            });
        }
    }

    // Evening suggestions (17-22)
    if (hour >= 17 && hour < 22) {
        const personalTasks = tasks.filter(t => t.category === 'personal');
        if (personalTasks.length > 0) {
            suggestions.push({
                type: 'wind-down',
                icon: '🌙',
                message: `Evening task: ${personalTasks[0].title}`,
                task: personalTasks[0]
            });
        }
    }

    // Overdue tasks
    const overdueTasks = tasks.filter(t =>
        t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed'
    );
    if (overdueTasks.length > 0) {
        suggestions.push({
            type: 'urgent',
            icon: '⚠️',
            message: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}! Start now.`,
            tasks: overdueTasks
        });
    }

    // Pattern-based suggestions
    if (userPatterns.mostProductiveHour === hour) {
        suggestions.push({
            type: 'pattern',
            icon: '⚡',
            message: `Your peak hour! You usually complete tasks now.`,
        });
    }

    return suggestions;
};

// 8. Auto-categorize task from title
export const autoCategorizeTas = (title) => {
    const titleLower = title.toLowerCase();

    if (titleLower.match(/work|meeting|email|report|project|deadline/)) {
        return 'work';
    }
    if (titleLower.match(/exercise|gym|run|workout|health|doctor/)) {
        return 'health';
    }
    if (titleLower.match(/learn|study|read|course|tutorial|practice/)) {
        return 'learning';
    }
    if (titleLower.match(/pay|bill|budget|money|bank|finance/)) {
        return 'finance';
    }
    if (titleLower.match(/friend|family|call|visit|party|social/)) {
        return 'social';
    }

    return 'personal';
};

// 9. Smart Task Duration Estimate
export const estimateTaskDuration = (task) => {
    // Based on category and complexity
    const baseDurations = {
        work: 60,
        learning: 45,
        health: 30,
        personal: 30,
        finance: 20,
        social: 60
    };

    let duration = baseDurations[task.category] || 30;

    // Adjust for priority
    if (task.priority === 'high') duration *= 1.5;

    // Adjust for title length (longer = more complex)
    if (task.title.length > 50) duration *= 1.2;

    return Math.round(duration);
};

export default {
    calculateSmartPriority,
    suggestBestTimeSlot,
    calculateReminderTimes,
    learnUserPatterns,
    suggestSubtasks,
    generateDailyPlan,
    generateSmartSuggestions,
    autoCategorizeTas,
    estimateTaskDuration
};
