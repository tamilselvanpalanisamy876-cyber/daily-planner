import React, { useEffect } from 'react';

const ReminderSystem = ({ tasks }) => {
    useEffect(() => {
        if (!tasks || tasks.length === 0) return;

        const checkReminders = () => {
            const now = new Date();
            tasks.forEach(task => {
                if (task.dueDate && task.status !== 'completed') {
                    const due = new Date(task.dueDate);
                    // Check if task is due within the last minute (to avoid repeated notifications)
                    const diff = now - due;
                    if (diff >= 0 && diff < 60000) { // 0 to 60 seconds past due
                        new Notification('Task Due!', {
                            body: `It's time for: ${task.title}`,
                            icon: '/vite.svg'
                        });
                    }
                }
            });
        };

        // Check every minute
        const interval = setInterval(checkReminders, 60000);

        // Initial check
        checkReminders();

        return () => clearInterval(interval);
    }, [tasks]);

    return null; // This component doesn't render anything
};

export default ReminderSystem;
