import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <Toaster
    position="bottom-right"
    toastOptions={{
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        fontSize: '14px',
      },
      success: { iconTheme: { primary: '#22d3ee', secondary: '#0f172a' } },
      error: { iconTheme: { primary: '#f43f5e', secondary: '#0f172a' } },
    }}
  />
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)