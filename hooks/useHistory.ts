import { useState, useCallback, useEffect } from 'react';
import { History, Stroke } from '../types';

export const useHistory = <T,>(initialState: T, initialHistory: History) => {
    const [history, setHistory] = useState<T[]>(initialHistory.stack as T[]);
    const [index, setIndex] = useState(initialHistory.index);

    useEffect(() => {
        setHistory(initialHistory.stack as T[]);
        setIndex(initialHistory.index);
    }, [initialHistory]);


    const setState = useCallback((action: T | ((prevState: T) => T)) => {
        const newState = typeof action === 'function' ? (action as (prevState: T) => T)(history[index]) : action;
        const newHistory = history.slice(0, index + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setIndex(newHistory.length - 1);
    }, [history, index]);

    const replaceState = useCallback((newState: T) => {
        const newHistory = [...history];
        newHistory[index] = newState;
        setHistory(newHistory);
    }, [history, index]);

    const undo = useCallback(() => {
        if (index > 0) {
            setIndex(index - 1);
        }
    }, [index]);

    const redo = useCallback(() => {
        if (index < history.length - 1) {
            setIndex(index + 1);
        }
    }, [index, history.length]);

    const getFullHistory = useCallback(() => {
        return {
            stack: history as Stroke[][],
            index: index
        };
    }, [history, index]);

    return {
        state: history[index] || initialState,
        setState,
        replaceState,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
        getFullHistory,
    };
};