import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Calendar = ({ tasks = [], onDateClick, onAddTask }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // month, week, day

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    const renderMonthView = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
        const days = [];
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Empty cells before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayTasks = getTasksForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                    onClick={() => onDateClick && onDateClick(date)}
                    style={{
                        padding: 'var(--space-sm)',
                        border: '1px solid var(--text-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        minHeight: '80px',
                        background: isToday ? 'linear-gradient(135deg, var(--ios-blue), var(--ios-purple))' : 'var(--bg-secondary)',
                        color: isToday ? 'white' : 'var(--text-primary)',
                        transition: 'all var(--transition-fast)',
                    }}
                >
                    <div style={{ fontWeight: '600', marginBottom: 'var(--space-xs)' }}>{day}</div>
                    <div style={{ fontSize: '0.75rem' }}>
                        {dayTasks.slice(0, 2).map((task, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: 'var(--ios-teal)',
                                    color: 'white',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    marginBottom: '2px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {task.title}
                            </div>
                        ))}
                        {dayTasks.length > 2 && (
                            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                                +{dayTasks.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 'var(--space-xs)',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {weekDays.map(day => (
                        <div key={day} style={{
                            textAlign: 'center',
                            fontWeight: '600',
                            color: 'var(--text-secondary)',
                            fontSize: '0.85rem',
                        }}>
                            {day}
                        </div>
                    ))}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 'var(--space-xs)',
                }}>
                    {days}
                </div>
            </div>
        );
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div style={{ padding: 'var(--space-md)' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)',
            }}>
                <h2 style={{ margin: 0 }}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button
                        onClick={previousMonth}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        style={{
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            {renderMonthView()}
        </div>
    );
};

export default Calendar;
