import React, { useState, useEffect } from 'react';
import './notification.css';

function Notification({ message, type, duration = 7000 }) {
    const [visible, setVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    
    useEffect(() => {
        // Auto-hide after duration
        const hideTimer = setTimeout(() => {
            setIsExiting(true);
        }, duration);
        
        // Remove from DOM after animation completes
        const removeTimer = setTimeout(() => {
            setVisible(false);
        }, duration + 600); // 600ms for slideOut animation
        
        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, [duration]);
    
    if (!visible) return null;
    
    // Icon based on notification type
    const getIcon = () => {
        if (type === 'success') {
            return '✓';
        } else if (type === 'error') {
            return '✕';
        }
        return '';
    };
    
    return (
        <div className={`notification ${type} ${isExiting ? 'exit' : ''}`}>
            <div className="notification-icon">{getIcon()}</div>
            <div className="notification-content">{message}</div>
        </div>
    );
}

export default Notification;
