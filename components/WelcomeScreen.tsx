import React from 'react';
import { PenIcon } from './icons';

interface WelcomeScreenProps {
    onAddPage: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAddPage }) => {
    return (
        <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-white select-none">
            <div className="text-blue-400 mb-8">
                <PenIcon className="w-24 h-24" />
            </div>
            <h1 className="text-5xl font-bold mb-3">Deep Whiteboard</h1>
            <p className="text-xl text-slate-400 mb-10">Lets write with Deeply, Deep Rudra</p>
            <button
                onClick={onAddPage}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
                Create New Page
            </button>
        </div>
    );
};

export default WelcomeScreen;