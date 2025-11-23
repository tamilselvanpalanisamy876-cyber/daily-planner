import React, { useState, useEffect } from 'react';
import { Check, Flame } from 'lucide-react';

const defaultHabits = [
    { id: '1', name: 'Morning Exercise', icon: '🏃', category: 'health', streak: 0 },
    { id: '2', name: 'Read 30 min', icon: '📖', category: 'learning', streak: 0 },
    { id: '3', name: 'Drink 8 glasses water', icon: '💧', category: 'health', streak: 0 },
    { id: '4', name: 'Meditate', icon: '🧘', category: 'health', streak: 0 },
    { id: '5', name: 'No social media', icon: '📵', category: 'personal', streak: 0 },
];

const HabitsTracker = () => {
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : defaultHabits;
    });

    const [completedToday, setCompletedToday] = useState(() => {
        const saved = localStorage.getItem('habitsCompletedToday');
        const savedDate = localStorage.getItem('habitsDate');
        const today = new Date().toDateString();

        if (savedDate === today && saved) {
            return JSON.parse(saved);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('habits', JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        const today = new Date().toDateString();
        localStorage.setItem('habitsCompletedToday', JSON.stringify(completedToday));
        localStorage.setItem('habitsDate', today);
    }, [completedToday]);

    const toggleHabit = (habitId) => {
        if (completedToday.includes(habitId)) {
            setCompletedToday(completedToday.filter(id => id !== habitId));
            setHabits(habits.map(h =>
                h.id === habitId ? { ...h, streak: Math.max(0, h.streak - 1) } : h
            ));
        } else {
            setCompletedToday([...completedToday, habitId]);
            setHabits(habits.map(h =>
                h.id === habitId ? { ...h, streak: h.streak + 1 } : h
            ));
        }
    };

    const completionRate = habits.length > 0
        ? Math.round((completedToday.length / habits.length) * 100)
        : 0;

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            boxShadow: 'var(--shadow-sm)',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-md)',
            }}>
                <h3 style={{ margin: 0 }}>Daily Habits</h3>
                <div style={{
                    background: 'linear-gradient(135deg, var(--ios-green), var(--ios-teal))',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                }}>
                    {completionRate}% Complete
                </div>
            </div>

            <div style={{
                display: 'grid',
                gap: 'var(--space-sm)',
            }}>
                {habits.map(habit => {
                    const isCompleted = completedToday.includes(habit.id);
                    return (
                        <div
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-md)',
                                padding: 'var(--space-md)',
                                background: isCompleted ? 'var(--ios-green)20' : 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                border: `2px solid ${isCompleted ? 'var(--ios-green)' : 'transparent'}`,
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isCompleted ? 'var(--ios-green)' : 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                transition: 'all var(--transition-fast)',
                            }}>
                                {isCompleted ? <Check size={24} color="white" /> : habit.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: '500',
                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                    opacity: isCompleted ? 0.7 : 1,
                                }}>
                                    {habit.name}
                                </div>
                                {habit.streak > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.8rem',
                                        color: 'var(--ios-orange)',
                                        marginTop: '4px',
                                    }}>
                                        <Flame size={14} />
                                        <span>{habit.streak} day streak</span>
                                    </div>
                                )}
                            </div>

                            {isCompleted && (
                                <div style={{
                                    background: 'var(--ios-green)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                }}>
                                    Done!
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitsTracker;
