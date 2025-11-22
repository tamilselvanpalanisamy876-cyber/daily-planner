import React, { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';

// Mock initial data
const initialTasks = {
    '9': [{ id: 'task-1', content: 'Daily Standup' }],
    '10': [{ id: 'task-2', content: 'Code Review' }],
    '14': [{ id: 'task-3', content: 'Focus Session' }],
};

const Schedule = () => {
    const [schedule, setSchedule] = useState(initialTasks);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) return;

        // Dropped in the same slot and index
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceHour = source.droppableId;
        const destHour = destination.droppableId;

        const sourceList = [...(schedule[sourceHour] || [])];
        const destList = sourceHour === destHour ? sourceList : [...(schedule[destHour] || [])];

        const [removed] = sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, removed);

        setSchedule({
            ...schedule,
            [sourceHour]: sourceList,
            [destHour]: destList,
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {hours.map(hour => (
                    <div key={hour} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '60px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.9rem', paddingTop: '0.5rem' }}>
                            {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                        </div>

                        <StrictModeDroppable droppableId={String(hour)}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="glass-panel"
                                    style={{
                                        flex: 1,
                                        minHeight: '60px',
                                        padding: '0.5rem',
                                        borderLeft: '2px solid var(--surface-light)',
                                        background: snapshot.isDraggingOver ? 'rgba(255, 255, 255, 0.05)' : undefined,
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {(schedule[hour] || []).map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        userSelect: 'none',
                                                        padding: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        borderRadius: 'var(--radius-md)',
                                                        background: 'rgba(99, 102, 241, 0.2)',
                                                        borderLeft: '3px solid var(--primary-color)',
                                                        color: 'var(--text-primary)',
                                                        ...provided.draggableProps.style
                                                    }}
                                                >
                                                    {task.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </StrictModeDroppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default Schedule;
