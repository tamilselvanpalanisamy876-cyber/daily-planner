import React, { useState, useEffect } from 'react';
import { Bell, Clock, Zap, Settings as SettingsIcon, X } from 'lucide-react';
import { calculateReminderTimes } from '../utils/smartLogic';

const SmartReminderSettings = ({ task, onSave, onClose }) => {
    const [settings, setSettings] = useState({
        enabled: true,
        smartMode: true, // AI-like automatic reminders
        customReminders: [],
        beforeDue: {
            '1hour': true,
            '2hours': false,
            '1day': true,
            '1week': false
        },
        recurringPattern: 'none', // none, daily, weekly, monthly
        quietHours: {
            enabled: false,
            start: '22:00',
            end: '07:00'
        }
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        // Load saved settings
        const saved = localStorage.getItem(`reminder-${task?._id}`);
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, [task]);

    const handleSave = () => {
        localStorage.setItem(`reminder-${task?._id}`, JSON.stringify(settings));

        // Generate smart reminders
        if (settings.smartMode && task) {
            const smartReminders = calculateReminderTimes(task);
            console.log('Smart reminders generated:', smartReminders);
        }

        onSave && onSave(settings);
        onClose && onClose();
    };

    const toggleBeforeDue = (key) => {
        setSettings({
            ...settings,
            beforeDue: {
                ...settings.beforeDue,
                [key]: !settings.beforeDue[key]
            }
        });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 'var(--space-md)',
        }}>
            <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg)',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-lg)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-lg)',
                }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <Bell size={24} color="var(--ios-blue)" />
                        Smart Reminders
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Smart Mode Toggle */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                    color: 'white',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <Zap size={20} />
                        <strong>AI-Like Smart Mode</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                        Automatically calculates best reminder times based on priority, due date, and your patterns
                    </p>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        marginTop: 'var(--space-sm)',
                        cursor: 'pointer',
                    }}>
                        <input
                            type="checkbox"
                            checked={settings.smartMode}
                            onChange={(e) => setSettings({ ...settings, smartMode: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <span>Enable Smart Mode</span>
                    </label>
                </div>

                {/* Before Due Reminders */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>
                        <Clock size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        Remind me before due
                    </h3>
                    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                        {[
                            { key: '1hour', label: '1 hour before', icon: '⏰' },
                            { key: '2hours', label: '2 hours before', icon: '⏱️' },
                            { key: '1day', label: '1 day before', icon: '📅' },
                            { key: '1week', label: '1 week before', icon: '📆' },
                        ].map(({ key, label, icon }) => (
                            <label
                                key={key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    padding: 'var(--space-sm)',
                                    background: settings.beforeDue[key] ? 'var(--ios-blue)20' : 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    border: `2px solid ${settings.beforeDue[key] ? 'var(--ios-blue)' : 'transparent'}`,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={settings.beforeDue[key]}
                                    onChange={() => toggleBeforeDue(key)}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                                <span style={{ flex: 1 }}>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Recurring Pattern */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>
                        🔄 Recurring Pattern
                    </h3>
                    <select
                        value={settings.recurringPattern}
                        onChange={(e) => setSettings({ ...settings, recurringPattern: e.target.value })}
                        style={{
                            width: '100%',
                            padding: 'var(--space-sm)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--text-tertiary)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '15px',
                        }}
                    >
                        <option value="none">No repeat</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekdays">Weekdays only</option>
                        <option value="weekends">Weekends only</option>
                    </select>
                </div>

                {/* Advanced Settings */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--ios-blue)',
                        cursor: 'pointer',
                        padding: 'var(--space-sm)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                    }}
                >
                    <SettingsIcon size={16} />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                </button>

                {showAdvanced && (
                    <div style={{
                        marginTop: 'var(--space-md)',
                        padding: 'var(--space-md)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                    }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)' }}>
                            🌙 Quiet Hours
                        </h4>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <input
                                type="checkbox"
                                checked={settings.quietHours.enabled}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    quietHours: { ...settings.quietHours, enabled: e.target.checked }
                                })}
                            />
                            <span>Enable quiet hours</span>
                        </label>
                        {settings.quietHours.enabled && (
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From</label>
                                    <input
                                        type="time"
                                        value={settings.quietHours.start}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            quietHours: { ...settings.quietHours, start: e.target.value }
                                        })}
                                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To</label>
                                    <input
                                        type="time"
                                        value={settings.quietHours.end}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            quietHours: { ...settings.quietHours, end: e.target.value }
                                        })}
                                        style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-sm)',
                    marginTop: 'var(--space-lg)',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--text-tertiary)',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: '600',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: '600',
                        }}
                    >
                        Save Reminders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartReminderSettings;
