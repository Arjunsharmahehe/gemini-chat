import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import ModelContextProvider from './context/ModelContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModelContextProvider>
      <App />
      <Analytics />
    </ModelContextProvider>
  </StrictMode>,
)
