import React from 'react';
import { RectangleIcon, TrashIcon } from './icons'; // Using TrashIcon for close

interface AddPageModalProps {
    onAddPage: (aspectRatio: '4:3' | '16:9') => void;
    onClose: () => void;
}

const AddPageModal: React.FC<AddPageModalProps> = ({ onAddPage, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 p-8 rounded-lg text-white border border-slate-700 shadow-2xl relative w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Choose Page Size</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => onAddPage('4:3')}
                        className="flex-1 flex flex-col items-center justify-center gap-3 p-6 bg-slate-700 rounded-lg hover:bg-slate-600 border border-slate-600 hover:border-blue-500 transition-all"
                    >
                        <RectangleIcon className="w-16 h-12 text-slate-400"/>
                        <span className="font-semibold">Standard (4:3)</span>
                    </button>
                    <button
                        onClick={() => onAddPage('16:9')}
                        className="flex-1 flex flex-col items-center justify-center gap-3 p-6 bg-slate-700 rounded-lg hover:bg-slate-600 border border-slate-600 hover:border-blue-500 transition-all"
                    >
                        <RectangleIcon className="w-24 h-12 text-slate-400"/>
                        <span className="font-semibold">Widescreen (16:9)</span>
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-full"
                    title="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default AddPageModal;
