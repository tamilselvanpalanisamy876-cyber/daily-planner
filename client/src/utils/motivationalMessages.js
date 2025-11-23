// Motivational messages with emojis
export const motivationalMessages = {
    morning: [
        "Good morning! Ready to crush it today? ☀️",
        "Rise and shine! Let's make today amazing! 🌅",
        "Morning! What's the first win you'll get today? 🎯",
        "Hey there! Time to turn dreams into reality! ✨",
    ],
    afternoon: [
        "You're doing great! Keep that momentum going! 💪",
        "Afternoon check-in: What are you working on? 🚀",
        "Halfway through the day - you've got this! 🔥",
        "Still crushing it? Let's finish strong! ⚡",
    ],
    evening: [
        "Evening! How was your productive day? 🌙",
        "Winding down? Don't forget to plan tomorrow! 📝",
        "Great work today! Time to relax! 🎉",
        "You did amazing today! Rest well! ⭐",
    ],
    taskComplete: [
        "Amazing work! One step closer to your goals! 🎉",
        "Boom! Task crushed! You're on fire! 🔥",
        "Yes! Another win in the books! ✅",
        "Fantastic! Keep that energy going! 💫",
        "Nailed it! What's next on your list? 🎯",
    ],
    taskCreated: [
        "New task added! Let's make it happen! 📌",
        "Great! Breaking it down into steps! 📋",
        "Added to your list! You've got a plan! ✨",
        "Nice! One more goal to conquer! 🎯",
    ],
    idle: [
        "Hey! What are you working on right now? 🤔",
        "Still there? Let's get back to it! 💪",
        "Taking a break? That's important too! ☕",
        "What's keeping you busy? 👀",
    ],
    encouragement: [
        "You're doing better than you think! 🌟",
        "Every small step counts! Keep going! 🚶",
        "Believe in yourself! You've got this! 💪",
        "Progress, not perfection! 📈",
        "You're capable of amazing things! ✨",
    ],
    focus: [
        "Time to focus! You've got this! 🎯",
        "Let's get in the zone! 🧘",
        "Deep work mode: activated! 💻",
        "Focus time! Block out the noise! 🔇",
    ],
    celebration: [
        "Wow! Look at you go! 🎊",
        "You're absolutely crushing it! 🏆",
        "This is what success looks like! 🌟",
        "Keep this energy! You're unstoppable! 🚀",
    ],
};

// Get time-based greeting
export const getTimeBasedMessage = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return motivationalMessages.morning[Math.floor(Math.random() * motivationalMessages.morning.length)];
    } else if (hour < 18) {
        return motivationalMessages.afternoon[Math.floor(Math.random() * motivationalMessages.afternoon.length)];
    } else {
        return motivationalMessages.evening[Math.floor(Math.random() * motivationalMessages.evening.length)];
    }
};

// Get random message from category
export const getRandomMessage = (category) => {
    const messages = motivationalMessages[category] || motivationalMessages.encouragement;
    return messages[Math.floor(Math.random() * messages.length)];
};

// Get contextual message based on activity
export const getContextualMessage = (context) => {
    switch (context) {
        case 'taskComplete':
            return getRandomMessage('taskComplete');
        case 'taskCreated':
            return getRandomMessage('taskCreated');
        case 'idle':
            return getRandomMessage('idle');
        case 'focus':
            return getRandomMessage('focus');
        case 'celebration':
            return getRandomMessage('celebration');
        default:
            return getTimeBasedMessage();
    }
};
