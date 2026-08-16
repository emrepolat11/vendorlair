import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import PreviewEnhancements from './previewEnhancements'
import PlanLimits from './planLimits'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PlanLimits />
    <App />
    <PreviewEnhancements />
  </React.StrictMode>
)
