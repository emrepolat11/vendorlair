import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import PreviewEnhancements from './previewEnhancements'
import PlanLimits from './planLimits'
import MobileResponsive from './mobileResponsive'
import ThemeMode from './themeMode'

const authMode = new URLSearchParams(window.location.search).get('mode')
if (authMode === 'login' || authMode === 'signup') {
  localStorage.removeItem('vl_session')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeMode />
    <PlanLimits />
    <App />
    <PreviewEnhancements />
    <MobileResponsive />
  </React.StrictMode>
)
