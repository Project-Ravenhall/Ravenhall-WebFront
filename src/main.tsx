import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1e1e2d',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        error: {
          style: {
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        }
      }}
    />
  </StrictMode>,
)