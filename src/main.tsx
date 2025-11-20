import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { CategoryProvider } from './context/CategoryProvider.tsx'
import { GigProvider } from './context/GigProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CategoryProvider>
          <GigProvider>
          <App />
          </GigProvider>
        </CategoryProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
