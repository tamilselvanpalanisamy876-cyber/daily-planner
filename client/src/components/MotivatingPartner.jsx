import React, { useState, useEffect } from 'react';
import { getTimeBasedMessage, getContextualMessage } from '../utils/motivationalMessages';

const MotivatingPartner = ({ onTaskComplete, onTaskCreate, isIdle }) => {
    const [permission, setPermission] = useState(Notification.permission);

    // Request notification permission on mount
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(result => {
                setPermission(result);
            });
        }
    }, []);

    // Send notification helper
    const sendNotification = (message) => {
        if (permission === 'granted') {
            new Notification('Your Motivating Partner 🤖', {
                body: message,
                icon: '/vite.svg',
                badge: '/vite.svg',
                tag: 'motivator',
                requireInteraction: false,
            });
        }
    };

    // Show initial greeting
    useEffect(() => {
        const timer = setTimeout(() => {
            sendNotification(getTimeBasedMessage());
        }, 3000); // 3 seconds after load
        return () => clearTimeout(timer);
    }, [permission]);

    // Periodic check-ins (every 10 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance
                sendNotification(getContextualMessage('idle'));
            }
        }, 600000); // Every 10 minutes

        return () => clearInterval(interval);
    }, [permission]);

    // React to task completion
    useEffect(() => {
        if (onTaskComplete) {
            sendNotification(getContextualMessage('taskComplete'));
        }
    }, [onTaskComplete, permission]);

    // React to task creation
    useEffect(() => {
        if (onTaskCreate) {
            sendNotification(getContextualMessage('taskCreated'));
        }
    }, [onTaskCreate, permission]);

    // This component doesn't render anything visible
    return null;
};

export default MotivatingPartner;
