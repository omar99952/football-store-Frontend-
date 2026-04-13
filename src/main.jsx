import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="739486864972-v3lm8mhs4p96ss6euassum5t7qfgqek9.apps.googleusercontent.com">
      <Router>
        <App />
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>
)