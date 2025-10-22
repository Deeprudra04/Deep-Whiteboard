
import React from 'react';
import { Toast } from '../types';

interface ToastProps {
    toast: Toast;
}

const ToastComponent: React.FC<ToastProps> = ({ toast }) => {
    const baseClasses = 'px-4 py-2 rounded-md shadow-lg text-white font-semibold text-sm';
    const typeClasses = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[toast.type]}`}>
            {toast.message}
        </div>
    );
};

export default ToastComponent;
