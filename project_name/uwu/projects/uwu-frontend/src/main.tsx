import React from 'react'
import ReactDOM from 'react-dom/client'
import TrustMeApp from './components/TrustMeApp'
import './styles/main.css'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="dark">
      <ErrorBoundary>
        <TrustMeApp />
      </ErrorBoundary>
    </div>
  </React.StrictMode>,
)
