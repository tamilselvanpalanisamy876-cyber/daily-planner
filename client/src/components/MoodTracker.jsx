import React, { useState } from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import Button from './Button';

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);

    const moods = [
        { id: 'happy', icon: Smile, color: '#10b981', label: 'Happy' },
        { id: 'normal', icon: Meh, color: '#f59e0b', label: 'Normal' },
        { id: 'low', icon: Frown, color: '#ef4444', label: 'Low' },
    ];

    const handleMoodSelect = (moodId) => {
        setSelectedMood(moodId);
        // TODO: Send to backend
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>How are you feeling today?</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {moods.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.id;
                    return (
                        <button
                            key={mood.id}
                            onClick={() => handleMoodSelect(mood.id)}
                            style={{
                                background: isSelected ? 'var(--surface-light)' : 'transparent',
                                border: isSelected ? `2px solid ${mood.color}` : '2px solid transparent',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: isSelected ? mood.color : 'var(--text-secondary)'
                            }}
                        >
                            <Icon size={32} />
                            <span style={{ fontSize: '0.8rem' }}>{mood.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodTracker;
