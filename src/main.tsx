import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './react-router/AppRoutes.tsx'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NuqsAdapter>
      <AppRoutes />
    </NuqsAdapter>
  </React.StrictMode>,
)
