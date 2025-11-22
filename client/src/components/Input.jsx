import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, ...props }) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
        </div>
    );
};

export default Input;
