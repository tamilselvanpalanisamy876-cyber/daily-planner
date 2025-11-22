import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const TaskForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            priority
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
            />

            <Input
                label="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, study, health"
            />

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Priority</label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%' }}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit">Add Task</Button>
            </div>
        </form>
    );
};

export default TaskForm;
