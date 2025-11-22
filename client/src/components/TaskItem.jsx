import React from 'react';
import { CheckCircle, Circle, Trash2, Tag } from 'lucide-react';
import Card from './Card';

const TaskItem = ({ task, onToggle, onDelete }) => {
    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444'
    };

    return (
        <div className="glass-panel" style={{
            padding: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: `4px solid ${priorityColors[task.priority]}`
        }}>
            <button
                onClick={() => onToggle(task._id)}
                style={{ background: 'none', border: 'none', color: task.status === 'completed' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer' }}
            >
                {task.status === 'completed' ? <CheckCircle /> : <Circle />}
            </button>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>
                    {task.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {task.tags.map((tag, index) => (
                        <span key={index} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Tag size={12} /> {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onDelete(task._id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default TaskItem;
