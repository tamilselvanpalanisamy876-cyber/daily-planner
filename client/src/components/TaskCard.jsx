import React from 'react';
import { Clock, Zap, Target, Calendar } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
    const getPriorityColor = (score) => {
        if (score >= 80) return 'var(--ios-red)';
        if (score >= 60) return 'var(--ios-orange)';
        if (score >= 40) return 'var(--ios-yellow)';
        return 'var(--ios-green)';
    };

    const getPriorityIcon = (score) => {
        if (score >= 80) return '🔥';
        if (score >= 60) return '⚡';
        if (score >= 40) return '📌';
        return '✅';
    };

    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline';
        const date = new Date(deadline);
        const now = new Date();
        const diffHours = (date - now) / (1000 * 60 * 60);

        if (diffHours < 0) return '⚠️ Overdue';
        if (diffHours < 24) return `⏰ ${Math.round(diffHours)}h left`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDifficultyStars = (difficulty) => {
        return '⭐'.repeat(difficulty || 3);
    };

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            border: `2px solid ${getPriorityColor(task.priorityScore)}`,
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-sm)',
            }}>
                <span style={{ fontSize: '1.5rem' }}>{getPriorityIcon(task.priorityScore)}</span>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '4px', fontSize: '1.1rem' }}>
                        {task.title}
                    </h4>
                    {task.scheduledTime && (
                        <div style={{
                            display: 'inline-block',
                            background: 'var(--ios-blue)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                        }}>
                            🕐 {task.scheduledTime}
                        </div>
                    )}
                </div>
                <div style={{
                    background: getPriorityColor(task.priorityScore),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                }}>
                    {task.priorityScore}
                </div>
            </div>

            {/* Details Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--space-xs)',
                marginBottom: 'var(--space-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Target size={14} />
                    <span>Importance: {task.importance}/10</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} />
                    <span>Difficulty: {getDifficultyStars(task.difficulty)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    <span>{task.estimatedDuration || 30} min</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    <span>{formatDeadline(task.deadline)}</span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                {task.status !== 'Done' && (
                    <button
                        onClick={() => onStatusChange(task._id, 'Done')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: 'var(--ios-green)',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        ✓ Mark Done
                    </button>
                )}
                {task.status === 'Backlog' && (
                    <button
                        onClick={() => onStatusChange(task._id, 'Scheduled')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--ios-blue)',
                            background: 'transparent',
                            color: 'var(--ios-blue)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Schedule
                    </button>
                )}
                <button
                    onClick={() => onDelete(task._id)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                    }}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
