import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './react-router/AppRoutes.tsx'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)