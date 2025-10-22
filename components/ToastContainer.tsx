
import React from 'react';
import { Toast } from '../types';
import ToastComponent from './Toast';

interface ToastContainerProps {
    toasts: Toast[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed top-5 right-5 z-50 space-y-2">
            {toasts.map(toast => (
                <ToastComponent key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default ToastContainer;
