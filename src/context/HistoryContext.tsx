import { createContext, useEffect, useState, useContext } from 'react';
import type { MessageType } from '../App';

type HistoryType = MessageType[];

type HistoryContextType = {
    history: HistoryType[];
    addHistory: (history: HistoryType) => void;
    deleteHistory: (index: number) => void;
    clearHistory: () => void;
}


const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export default function HistoryContextProvider({ children }: { children: React.ReactNode }) {
    const historyFromLocalStorage = localStorage.getItem('history');
    const initialHistory: HistoryType[] = historyFromLocalStorage ? JSON.parse(historyFromLocalStorage) : [];
    const [history, setHistory] = useState<HistoryType[]>(initialHistory);


    const addHistory = (newHistory: HistoryType) => {
        if (newHistory.length === 0) return; // Do not add empty history
        let flag = true
        for(let i= 0; i < history.length; i++){
            if (history[i][0].timestamp == newHistory[0].timestamp.toString()) {
                setHistory( prev => {
                    prev[i] = newHistory
                    return [...prev]
                })
                flag = false
            }
        }
        if (flag) setHistory(prev => [ newHistory, ...prev]);
    };

    const deleteHistory = (index: number) => {
        setHistory(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        localStorage.setItem('history', JSON.stringify(history));
    }, [history]);

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addHistory, deleteHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistoryContext() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistoryContext must be used within a HistoryContextProvider');
    }
    return context;
}