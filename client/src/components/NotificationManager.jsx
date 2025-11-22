import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import Button from './Button';

const NotificationManager = () => {
    const [permission, setPermission] = useState(Notification.permission);

    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
    };

    const sendTestNotification = () => {
        if (permission === 'granted') {
            new Notification('Daily Planner', {
                body: 'This is a test reminder! Stay focused. 🚀',
                icon: '/vite.svg' // Using Vite logo as placeholder
            });
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {permission !== 'granted' ? (
                <Button onClick={requestPermission} variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BellOff size={16} /> Enable Notifications
                </Button>
            ) : (
                <Button onClick={sendTestNotification} variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={16} /> Test Reminder
                </Button>
            )}
        </div>
    );
};

export default NotificationManager;
