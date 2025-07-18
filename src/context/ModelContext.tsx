import { createContext, useEffect, useState, useContext } from 'react';

type ModelContextType = {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    selectedMode: string;
    setSelectedMode: (mode: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export default function ModelContextProvider({ children }: { children: React.ReactNode }) {
    const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
    const [apiKey, setApiKey] = useState('');
    const [ selectedMode, setSelectedMode ] = useState('Assistant')

    useEffect(() => {
        const key = localStorage.getItem('apiKey');
        if (key) {
            setApiKey(key);
        }
    }, []);

    return (
        <ModelContext.Provider value={{ selectedModel, setSelectedModel, apiKey, setApiKey, selectedMode, setSelectedMode }}>
            {children}
        </ModelContext.Provider>
    );
}

export function useModelContext() {
    const context = useContext(ModelContext);
    if (!context) {
        throw new Error('useModelContext must be used within a ModelContextProvider');
    }
    return context;
}