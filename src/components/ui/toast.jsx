import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 focus:outline-none">
                <X size={18} />
            </button>
        </div>
    );
};

