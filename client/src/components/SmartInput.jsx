import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

const SmartInput = ({ onTaskCreate }) => {
    const [input, setInput] = useState('');
    const [parsedData, setParsedData] = useState(null);

    const parseInput = (text) => {
        const parsed = {
            title: text,
            importance: 5,
            difficulty: 3,
            deadline: null,
            estimatedDuration: 30
        };

        // 1. Priority/Importance detection: "priority 10" or "importance 8"
        const priorityMatch = text.match(/(?:priority|importance)\s+(\d+)/i);
        if (priorityMatch) {
            const value = parseInt(priorityMatch[1]);
            parsed.importance = Math.min(Math.max(value, 1), 10); // Clamp 1-10
            parsed.title = text.replace(priorityMatch[0], '').trim();
        }

        // 2. Difficulty detection: "easy", "medium", "hard", "very hard"
        const difficultyMatch = text.match(/\b(very\s+hard|hard|difficult|medium|easy)\b/i);
        if (difficultyMatch) {
            const diffMap = {
                'easy': 1,
                'medium': 3,
                'hard': 4,
                'difficult': 4,
                'very hard': 5
            };
            parsed.difficulty = diffMap[difficultyMatch[1].toLowerCase()] || 3;
            parsed.title = text.replace(difficultyMatch[0], '').trim();
        }

        // 3. Duration detection: "2 hours", "30 min", "1.5 hours"
        const durationMatch = text.match(/(\d+(?:\.\d+)?)\s*(min|minutes|hour|hours|hr|hrs)/i);
        if (durationMatch) {
            const value = parseFloat(durationMatch[1]);
            const unit = durationMatch[2].toLowerCase();
            if (unit.startsWith('hour') || unit.startsWith('hr')) {
                parsed.estimatedDuration = Math.round(value * 60);
            } else {
                parsed.estimatedDuration = Math.round(value);
            }
            parsed.title = text.replace(durationMatch[0], '').trim();
        }

        // 4. Tomorrow detection
        const tomorrowMatch = text.match(/\btomorrow\b/i);
        if (tomorrowMatch) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0); // Default to noon
            parsed.deadline = tomorrow;
            parsed.title = text.replace(tomorrowMatch[0], '').trim();
        }

        // 5. Today detection
        const todayMatch = text.match(/\btoday\b/i);
        if (todayMatch) {
            const today = new Date();
            today.setHours(18, 0, 0, 0); // Default to 6 PM today
            parsed.deadline = today;
            parsed.title = text.replace(todayMatch[0], '').trim();
        }

        // 6. Time detection: "at 5pm", "at 14:30", "at 2:30pm"
        const timeMatch = text.match(/at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
        if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const meridiem = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

            // Convert to 24-hour format
            if (meridiem === 'pm' && hours < 12) hours += 12;
            if (meridiem === 'am' && hours === 12) hours = 0;

            if (parsed.deadline) {
                parsed.deadline.setHours(hours, minutes, 0, 0);
            } else {
                // If no date specified, assume today
                const today = new Date();
                today.setHours(hours, minutes, 0, 0);
                parsed.deadline = today;
            }
            parsed.title = text.replace(timeMatch[0], '').trim();
        }

        // 7. Specific date detection: "on Monday", "on 25th"
        const dayMatch = text.match(/on\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
        if (dayMatch) {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const targetDay = days.indexOf(dayMatch[1].toLowerCase());
            const today = new Date();
            const currentDay = today.getDay();
            const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;

            const targetDate = new Date();
            targetDate.setDate(today.getDate() + daysUntilTarget);
            targetDate.setHours(12, 0, 0, 0);
            parsed.deadline = targetDate;
            parsed.title = text.replace(dayMatch[0], '').trim();
        }

        // Clean up title (remove extra spaces, "at", etc.)
        parsed.title = parsed.title
            .replace(/\s+/g, ' ')
            .replace(/^\s*at\s*/i, '')
            .trim();

        return parsed;
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInput(text);

        if (text.trim()) {
            const parsed = parseInput(text);
            setParsedData(parsed);
        } else {
            setParsedData(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && parsedData) {
            onTaskCreate(parsedData);
            setInput('');
            setParsedData(null);
        }
    };

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--space-lg)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <Sparkles size={20} color="var(--ios-purple)" />
                <h3 style={{ margin: 0 }}>Smart Input</h3>
                <span style={{
                    marginLeft: 'auto',
                    background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                }}>
                    AI-Like Parsing
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder='Try: "Study for ESS exam tomorrow at 2pm priority 10 duration 2 hours"'
                    style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--ios-blue)',
                        fontSize: '15px',
                        marginBottom: 'var(--space-sm)',
                    }}
                />

                {/* Parsed Preview */}
                {parsedData && (
                    <div style={{
                        background: 'var(--ios-blue)10',
                        border: '1px solid var(--ios-blue)40',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginBottom: 'var(--space-sm)',
                        fontSize: '0.9rem',
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--space-xs)', color: 'var(--ios-blue)' }}>
                            📝 Parsed:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-xs)' }}>
                            <div><strong>Title:</strong> {parsedData.title}</div>
                            <div><strong>Importance:</strong> {parsedData.importance}/10</div>
                            <div><strong>Difficulty:</strong> {parsedData.difficulty}/5</div>
                            <div><strong>Duration:</strong> {parsedData.estimatedDuration} min</div>
                            {parsedData.deadline && (
                                <div><strong>Deadline:</strong> {parsedData.deadline.toLocaleString()}</div>
                            )}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-sm)',
                    }}
                >
                    <Plus size={20} />
                    Add Task
                </button>
            </form>

            {/* Help Text */}
            <div style={{
                marginTop: 'var(--space-md)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
            }}>
                <strong>Examples:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                    <li>"Buy milk tomorrow at 5pm priority 8"</li>
                    <li>"Meeting with client on Monday at 10am duration 1 hour"</li>
                    <li>"Study for exam today priority 10 hard"</li>
                </ul>
            </div>
        </div>
    );
};

export default SmartInput;
