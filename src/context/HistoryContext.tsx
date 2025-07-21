import { createContext, useEffect, useState, useContext } from 'react';
import type { MessageType } from '../App';

export type HistoryType = {
    title: string;
    timestamp: Date | string;
    messages: MessageType[];
};

type HistoryContextType = {
    history: HistoryType[];
    addHistory: (newHistory: MessageType[]) => void;
    deleteHistory: (index: number) => void;
    clearHistory: () => void;
    changeTitle: (index: number, newTitle: string) => void;
}


const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export default function HistoryContextProvider({ children }: { children: React.ReactNode }) {
    const historyFromLocalStorage = localStorage.getItem('history');
    const initialHistory: HistoryType[] = historyFromLocalStorage ? JSON.parse(historyFromLocalStorage) : [];
    const [history, setHistory] = useState<HistoryType[]>(initialHistory);
    const [ title, setTitle ] = useState<string>('Untitled Chat');


    const addHistory = (newHistory: MessageType[]) => {
        if (newHistory.length === 0) return; // Do not add empty history
        let flag = true
        for(let i= 0; i < history.length; i++){
            if (history[i].messages[0].timestamp == newHistory[0].timestamp.toString()) {
                setHistory( prev => {
                    prev[i] = { title: prev[i].title, timestamp: prev[i].timestamp, messages: newHistory }
                    return [...prev]
                })
                flag = false
            }
        }
        if (flag) {
            const newTitle = newHistory[0].content.includes('||||||')
                ? newHistory[0].content.split('||||||')[1].slice(0, 28)
                : newHistory[0].content.slice(0, 28);
            const finalTitle = newTitle.length === 0 ? title : newTitle;
            setTitle(finalTitle);
            setHistory(prev => [ { title: finalTitle, timestamp: new Date(), messages: newHistory }, ...prev ]);
        }
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

    const changeTitle = (index: number, newTitle: string) => {
        setHistory(prev => {
            prev[index].title = newTitle;
            return [...prev];
        });
    }

    return (
        <HistoryContext.Provider value={{ history, addHistory, deleteHistory, clearHistory, changeTitle }}>
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