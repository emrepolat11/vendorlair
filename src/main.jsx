import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import PreviewEnhancements from './previewEnhancements'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <PreviewEnhancements />
  </React.StrictMode>
)
