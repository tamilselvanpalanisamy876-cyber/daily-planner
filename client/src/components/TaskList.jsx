import React, { useState, useContext } from 'react';
import TaskItem from './TaskItem';
import Button from './Button';
import Modal from './Modal';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import TaskContext from '../context/TaskContext';

const TaskList = () => {
    const { tasks, addTask: addTaskToContext, updateTask, deleteTask: deleteTaskFromContext, loading } = useContext(TaskContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addTask = async (newTask) => {
        try {
            await addTaskToContext(newTask);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to add task', err);
        }
    };

    const toggleTask = async (id) => {
        const task = tasks.find(t => t._id === id);
        if (task) {
            try {
                await updateTask(id, { status: task.status === 'completed' ? 'todo' : 'completed' });
            } catch (err) {
                console.error('Failed to toggle task', err);
            }
        }
    };

    const deleteTask = async (id) => {
        try {
            await deleteTaskFromContext(id);
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>My Tasks</h3>
                <Button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <Plus size={16} /> New Task
                </Button>
            </div>

            <div className="task-list">
                {tasks.map(task => (
                    <TaskItem key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
                <TaskForm onSubmit={addTask} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default TaskList;
