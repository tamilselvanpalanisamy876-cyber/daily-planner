import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({ tasks = [], onTaskSelect }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        category: 'all',
    });

    const searchTasks = () => {
        if (!query.trim()) return [];

        return tasks.filter(task => {
            const matchesQuery = task.title.toLowerCase().includes(query.toLowerCase()) ||
                task.description?.toLowerCase().includes(query.toLowerCase()) ||
                task.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

            const matchesStatus = filters.status === 'all' || task.status === filters.status;
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;

            return matchesQuery && matchesStatus && matchesPriority;
        });
    };

    const results = searchTasks();

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                border: '1px solid var(--text-tertiary)',
                boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            }}>
                <Search size={20} color="var(--text-secondary)" />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        marginLeft: 'var(--space-sm)',
                        fontSize: '15px',
                        outline: 'none',
                        color: 'var(--text-primary)',
                    }}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setIsOpen(false);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                    >
                        <X size={16} color="var(--text-secondary)" />
                    </button>
                )}
            </div>

            {/* Search Results */}
            {isOpen && query && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 'var(--space-xs)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                }}>
                    {results.length > 0 ? (
                        results.map(task => (
                            <div
                                key={task._id}
                                onClick={() => {
                                    onTaskSelect && onTaskSelect(task);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: 'var(--space-md)',
                                    borderBottom: '1px solid var(--text-tertiary)',
                                    cursor: 'pointer',
                                    transition: 'background var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                    {task.title}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    gap: 'var(--space-sm)',
                                }}>
                                    <span style={{
                                        background: task.priority === 'high' ? 'var(--danger-color)' :
                                            task.priority === 'medium' ? 'var(--warning-color)' :
                                                'var(--success-color)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                    }}>
                                        {task.priority}
                                    </span>
                                    <span>{task.status}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            padding: 'var(--space-lg)',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                        }}>
                            No tasks found
                        </div>
                    )}
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                />
            )}
        </div>
    );
};

export default SearchBar;
