import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import ModelContextProvider from './context/ModelContext.tsx'
import HistoryContextProvider from './context/HistoryContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModelContextProvider>
      <HistoryContextProvider>
        <App />
        <Analytics />
      </HistoryContextProvider>
    </ModelContextProvider>
  </StrictMode>,
)
