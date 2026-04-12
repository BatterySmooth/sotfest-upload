import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Config } from './core/Config';
import App from '@/App'
import '@/theme.css'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={Config.ClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)