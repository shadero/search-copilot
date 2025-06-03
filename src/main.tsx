import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './react-router/AppRoutes.tsx'
// import './index.css'

function App() {
  return (
    <div>
      <h1>Welcome to the React App</h1>
      <p>This is a simple application using React and React Router.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
)

export default App;